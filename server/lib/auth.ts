import { getTeableClient, Filter } from './teable';
import { getRequestHeader } from 'h3';

const SESSIONS_TABLE_ID = process.env.TEABLE_SESSIONS_TABLE_ID;
if (!SESSIONS_TABLE_ID) {
  throw new Error('TEABLE_SESSIONS_TABLE_ID environment variable is required');
}

export interface AuthContext {
  authenticated: boolean;
  userId?: string;
  roles: string[];
  businessOwnerships: string[];
  staffAssignments: any[];
  exp?: number;
}

export async function validateSession(sessionId: string): Promise<{ valid: boolean; context?: AuthContext }> {
  if (!sessionId) {
    return { valid: false };
  }

  try {
    const teable = getTeableClient();
    const sessionRecords = await teable.listRecords(SESSIONS_TABLE_ID, {
      filter: { fieldId: 'session_token_hash', operator: 'is', value: sessionId },
      maxRecords: 1,
    });

    if (sessionRecords.records.length === 0) {
      return { valid: false };
    }

    const sessionRecord = sessionRecords.records[0];
    const sessionFields = sessionRecord.fields as any;

    // Extract user_id from link field (may be object or array)
    let userId = sessionFields.user_id;
    if (Array.isArray(userId)) userId = userId[0];
    if (typeof userId === 'object' && userId !== null) userId = userId.id;

    // Update last accessed
    try {
      await teable.updateRecord(SESSIONS_TABLE_ID, sessionRecord.id as string, {
        last_seen_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Failed to update session last_seen:', e);
    }

    const roles = JSON.parse(sessionFields.roles || '["member"]');
    const businessOwnerships = JSON.parse(sessionFields.business_ownerships || '[]');
    const staffAssignments = JSON.parse(sessionFields.staff_assignments || '[]');

    return {
      valid: true,
      context: {
        authenticated: true,
        userId: userId as string,
        roles,
        businessOwnerships,
        staffAssignments,
        exp: Math.floor(new Date(sessionFields.expires_at as string).getTime() / 1000),
      },
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return { valid: false };
  }
}

export function extractSessionId(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
  return sessionMatch?.[1] || null;
}

export async function requireAuth(request: Request): Promise<{ context: any; error?: Response }> {
  const sessionId = extractSessionId(new Request(request.url, { headers: request.headers }));
  const result = await validateSession(sessionId || '');

  if (!result.valid || !result.context) {
    return {
      context: null,
      error: new Response(JSON.stringify({ ok: false, code: 'UNAUTHORIZED' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }

  return { context: result.context, error: undefined };
}

export function requireRole(allowedRoles: string[]) {
  return async (request: Request): Promise<{ context: any; error?: Response }> => {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult;

    const hasRole = authResult.context.roles.some((role: string) => allowedRoles.includes(role));
    if (!hasRole) {
      return {
        context: null,
        error: new Response(JSON.stringify({ ok: false, code: 'FORBIDDEN' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
      };
    }

    return { context: authResult.context, error: undefined };
  };
}

export function requireOwnership(businessIdParam: string = 'businessId') {
  return async (request: Request, params?: Record<string, string>): Promise<{ context: any; error?: Response }> => {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult;

    const businessId = params?.[businessIdParam] || new URL(request.url).searchParams.get(businessIdParam);
    if (!businessId) {
      return {
        context: null,
        error: new Response(JSON.stringify({ ok: false, code: 'MISSING_BUSINESS_ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      };
    }

    const hasOwnership = authResult.context.businessOwnerships.includes(businessId);
    if (!hasOwnership) {
      return {
        context: null,
        error: new Response(JSON.stringify({ ok: false, code: 'FORBIDDEN' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
      };
    }

    return { context: authResult.context, error: undefined };
  };
}

export function requireStaff(businessIdParam: string = 'businessId') {
  return async (request: Request, params?: Record<string, string>): Promise<{ context: any; error?: Response }> => {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult;

    const businessId = params?.[businessIdParam] || new URL(request.url).searchParams.get(businessIdParam);
    if (!businessId) {
      return {
        context: null,
        error: new Response(JSON.stringify({ ok: false, code: 'MISSING_BUSINESS_ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      };
    }

    const hasStaffAccess = authResult.context.staffAssignments.some(
      (assignment: any) => assignment.businessId === businessId
    );
    if (!hasStaffAccess) {
      return {
        context: null,
        error: new Response(JSON.stringify({ ok: false, code: 'FORBIDDEN' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
      };
    }

    return { context: authResult.context, error: undefined };
  };
}

export async function getCurrentUser(event: any): Promise<{
  authenticated: boolean;
  user?: any;
  isSuperadmin: boolean;
  isFoundingMember: boolean;
  isSuspended: boolean;
}> {
  let cookie = '';
  try {
    cookie = getRequestHeader(event, 'cookie') || '';
  } catch {
    cookie = (event?.req?.headers?.cookie) || '';
  }

  const sessionMatch = cookie.match(/session_id=([^;]+)/);
  const sessionId = sessionMatch?.[1];

  if (!sessionId) {
    return { authenticated: false, isSuperadmin: false, isFoundingMember: false, isSuspended: false };
  }

  const result = await validateSession(sessionId);
  if (!result.valid || !result.context) {
    return { authenticated: false, isSuperadmin: false, isFoundingMember: false, isSuspended: false };
  }

  const USERS_TABLE_ID = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';
  const teable = getTeableClient();

  let user: any = null;
  let isFoundingMember = false;
  let hasLifetimePro = false;
  let hasFeaturedBusinesses = false;
  let hasFeaturedGroups = false;
  let hasFeaturedEvents = false;
  let userEmail = '';

  // Look up user by Teable record ID (session stores the Teable record ID)
  try {
    const userRecord = await teable.getRecord(USERS_TABLE_ID, result.context.userId);
    if (userRecord) {
      user = { id: userRecord.id, ...userRecord.fields };
      userEmail = user.email || '';
      isFoundingMember = user.is_founding_member === true;
      if (isFoundingMember) {
        hasLifetimePro = user.pro_status === 'lifetime_paid' || user.pro_status === 'lifetime_founder';
        hasFeaturedBusinesses = user.featured_perk === true;
        hasFeaturedGroups = user.featured_perk === true;
        hasFeaturedEvents = user.featured_perk === true;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch user details:', e);
  }

  // Also check FounderLifetimeEntitlements table
  if (userEmail) {
    try {
      const { lookupFounderEntitlement } = await import('./founders.js');
      const entitlement = await lookupFounderEntitlement(userEmail);
      if (entitlement) {
        isFoundingMember = true;
        hasLifetimePro = entitlement.unlimited_pro;
        hasFeaturedBusinesses = entitlement.featured_businesses;
        hasFeaturedGroups = entitlement.featured_groups;
        hasFeaturedEvents = entitlement.featured_events;
      }
    } catch (e) {
      console.warn('Failed to check founder entitlements:', e);
    }
  }

  const isSuspended = user?.account_status === 'suspended' || user?.is_suspended === true;

  // If suspended, treat as unauthenticated
  if (isSuspended) {
    return { authenticated: false, isSuperadmin: false, isFoundingMember: false, isSuspended: true };
  }

  const superadminEmails = (process.env.SUPERADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
  const isSuperadmin = superadminEmails.includes(userEmail.toLowerCase());

  return {
    authenticated: true,
    user: user ? { ...user, hasLifetimePro, hasFeaturedBusinesses, hasFeaturedGroups, hasFeaturedEvents } : null,
    isSuperadmin,
    isFoundingMember,
  };
}