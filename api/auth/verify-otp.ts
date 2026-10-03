import { getTeableClient } from '../lib/teable';
import crypto from 'crypto';

const OTP_MAX_VERIFY_ATTEMPTS = parseInt(process.env.OTP_MAX_VERIFY_ATTEMPTS || '5', 10);

const USERS_TABLE_ID = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';

async function verifyOTPHash(code: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
}

function getEmailHash(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

async function createSession(teable: any, userId: string, roles: string[], businessOwnerships: string[], staffAssignments: any[]): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await teable.createRecord('tbl_sessions', {
    session_id: sessionId,
    user_id: userId,
    roles: JSON.stringify(['member']), // Default role
    business_ownerships: JSON.stringify([]),
    staff_assignments: JSON.stringify([]),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    last_accessed_at: new Date().toISOString(),
  });

  return sessionId;
}

export default async function handler(
  request: Request,
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (body: object) => void };
  }
): Promise<void> {
  if (request.method !== 'POST') {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Allow', 'POST');
    response.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    const body = await request.json();
    const email = body.email?.toLowerCase().trim();
    const code = body.code?.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      response.setHeader('Content-Type', 'application/json');
      response.status(400).json({ ok: false, code: 'INVALID_EMAIL' });
      return;
    }

    if (!code || !/^\d{6}$/.test(code)) {
      response.setHeader('Content-Type', 'application/json');
      response.status(400).json({ ok: false, code: 'INVALID_CODE' });
      return;
    }

    const teable = getTeableClient();
    const emailHash = getEmailHash(email);

    // Find valid OTP
    let otpRecord;
    try {
      const otpRecords = await teable.listRecords('tbl_otp_codes', {
        filter: `email_hash = "${getEmailHash(email)}" AND used = false AND expires_at >= "${new Date().toISOString()}"`,
        maxRecords: 1,
        sort: '-created_at',
      });

      if (otpRecords.records.length === 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(400).json({ ok: false, code: 'INVALID_CODE' });
        return;
      }

      otpRecord = otpRecords.records[0];
    } catch (e) {
      console.error('Failed to fetch OTP:', e);
      response.setHeader('Content-Type', 'application/json');
      response.status(400).json({ ok: false, code: 'INVALID_CODE' });
      return;
    }

    const otpFields = otpRecord.fields as any;

    // Check attempts
    if (otpFields.attempts >= 5) {
      response.setHeader('Content-Type', 'application/json');
      response.status(429).json({ ok: false, code: 'RATE_LIMITED' });
      return;
    }

    // Verify OTP
    const codeHash = otpRecord.fields.code_hash as string;
    const [salt, hash] = codeHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');

    if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash))) {
      // Increment attempts
      await teable.updateRecord('tbl_otp_codes', otpRecord.id, {
        attempts: (otpFields.attempts || 0) + 1,
      });

      response.setHeader('Content-Type', 'application/json');
      response.status(400).json({ ok: false, code: 'INVALID_CODE' });
      return;
    }

    // Mark OTP as used
    await teable.updateRecord('tbl_otp_codes', otpRecord.id, {
      used: true,
      used_at: new Date().toISOString(),
    });

    // Find or create user
    let userRecord;
    try {
      const userRecords = await teable.listRecords('tblB6Wiwy4KOx3Tjgui', {
        filter: `email = "${email}"`,
        maxRecords: 1,
      });

      if (userRecords.records.length === 0) {
        // Create new user
        const newUser = await teable.createRecord('tblB6Wiwy4KOx3Tjgui', {
          email: email,
          role: 'member',
          created_at: new Date().toISOString(),
        });
        userRecord = newUser;
      } else {
        userRecord = userRecords.records[0];
      }
    } catch (e) {
      console.error('Failed to find/create user:', e);
      response.setHeader('Content-Type', 'application/json');
      response.status(500).json({ ok: false, code: 'INTERNAL_ERROR' });
      return;
    }

    const userId = userRecord.id;

    // Fetch user's business ownerships
    let businessOwnerships: string[] = [];
    try {
      const bizRecords = await teable.listRecords('tbl8IOboEGdwYHqJck2', {
        filter: `created_by_user_id = "${userId}"`,
        maxRecords: 100,
      });
      businessOwnerships = bizRecords.records.map(r => r.id);
    } catch (e) {
      console.warn('Failed to fetch business ownerships:', e);
    }

    // Fetch user's staff assignments
    let staffAssignments: any[] = [];
    try {
      const staffRecords = await teable.listRecords('tblFemWKDqyaQtOqDCV', {
        filter: `user_id = "${userId}"`,
        maxRecords: 100,
      });
      staffAssignments = staffRecords.records.map(r => ({
        businessId: r.fields.business_id,
        role: r.fields.role,
      }));
    } catch (e) {
      console.warn('Failed to fetch staff assignments:', e);
    }

    // Determine roles
    const roles = ['member'];
    if (businessOwnerships.length > 0) roles.push('business_owner');
    if (staffAssignments.length > 0) roles.push('staff');

    // Create session
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    try {
      await teable.createRecord('tbl_sessions', {
        session_id: sessionId,
        user_id: userId,
        roles: JSON.stringify(roles),
        business_ownerships: JSON.stringify(businessOwnerships),
        staff_assignments: JSON.stringify([]),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to create session:', e);
      response.setHeader('Content-Type', 'application/json');
      response.status(500).json({ ok: false, code: 'INTERNAL_ERROR' });
      return;
    }

    // Set session cookie
    const cookieValue = `session_id=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}`;

    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Set-Cookie', cookieValue);
    response.status(200).json({
      authenticated: true,
      userId,
      roles: ['member'],
      businessOwnerships: [],
      staffAssignments: [],
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    response.setHeader('Content-Type', 'application/json');
    response.status(500).json({ ok: false, code: 'INTERNAL_ERROR' });
  }
}