import { getTeableClient, Filter } from './teable';

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
        userId: sessionFields.user_id as string,
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