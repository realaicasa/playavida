import { getTeableClient } from '../lib/teable';
import crypto from 'crypto';

function getEmailHash(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

export default async function handler(
  request: Request,
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (body: object) => void };
  }
): Promise<void> {
  const jsonResponse = (res: typeof response, status: number, body: object) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(body);
  };

  if (request.method !== 'POST') {
    return jsonResponse(response, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(response, 400, { ok: false, code: 'INVALID_JSON' });
    }

    const email = body.email?.toLowerCase().trim();
    const code = body.code?.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(response, 400, { ok: false, code: 'INVALID_EMAIL' });
    }

    if (!code || !/^\d{6}$/.test(code)) {
      return jsonResponse(response, 400, { ok: false, code: 'INVALID_CODE' });
    }

    const teable = getTeableClient();
    const emailHash = getEmailHash(email);

    // Find valid OTP
    let otpRecord;
    try {
      const otpRecords = await teable.listRecords('tblVe1AhQ3zLW3eijnw', {
        filter: 'email_hash = "' + emailHash + '" AND status = "issued" AND expires_at >= "' + new Date().toISOString() + '"',
        maxRecords: 1,
        sort: '-created_at',
      });

      if (otpRecords.records.length === 0) {
        return jsonResponse(response, 400, { ok: false, code: 'INVALID_CODE' });
      }

      otpRecord = otpRecords.records[0];
    } catch (e: any) {
      console.error('Failed to fetch OTP:', e?.message || e);
      return jsonResponse(response, 500, { ok: false, code: 'OTP_FETCH_FAILED', error: e?.message || 'Unknown error' });
    }

    const otpFields = otpRecord.fields as any;

    // Check attempts
    if ((otpFields.attempt_count || 0) >= 5) {
      return jsonResponse(response, 429, { ok: false, code: 'RATE_LIMITED' });
    }

    // Verify OTP
    const storedHash = otpRecord.fields.code_hash as string;
    if (!storedHash) {
      return jsonResponse(response, 400, { ok: false, code: 'INVALID_CODE' });
    }

    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');

    if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash))) {
      // Increment attempts
      await teable.updateRecord('tblVe1AhQ3zLW3eijnw', otpRecord.id, {
        attempt_count: (otpFields.attempt_count || 0) + 1,
      });

      return jsonResponse(response, 400, { ok: false, code: 'INVALID_CODE' });
    }

    // Mark OTP as consumed
    await teable.updateRecord('tblVe1AhQ3zLW3eijnw', otpRecord.id, {
      status: 'consumed',
      consumed_at: new Date().toISOString(),
    });

    // Find or create user
    let userRecord;
    try {
      const userRecords = await teable.listRecords('tblB6Wiwy4KOx3Tjgui', {
        filter: 'email = "' + email + '"',
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
    } catch (e: any) {
      console.error('Failed to find/create user:', e?.message || e);
      return jsonResponse(response, 500, { ok: false, code: 'USER_CREATE_FAILED', error: e?.message || 'Unknown error' });
    }

    const userId = userRecord.id;

    // Fetch user's business ownerships
    let businessOwnerships: string[] = [];
    try {
      const bizRecords = await teable.listRecords('tbl8IOboEGdwYHqJck2', {
        filter: 'created_by_user_id = "' + userId + '"',
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
        filter: 'user_id = "' + userId + '"',
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
    const sessionTokenHash = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    try {
      await teable.createRecord('tblap3ykSwQQk276MdN', {
        session_token_hash: sessionId,
        user_id: userId,
        roles: JSON.stringify(roles),
        business_ownerships: JSON.stringify(businessOwnerships),
        staff_assignments: JSON.stringify([]),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      });
    } catch (e: any) {
      console.error('Failed to create session:', e?.message || e);
      return jsonResponse(response, 500, { ok: false, code: 'SESSION_CREATE_FAILED', error: e?.message || 'Unknown error' });
    }

    // Get user public reference
    let publicReference = '';
    try {
      const userRecords = await teable.listRecords('tblB6Wiwy4KOx3Tjgui', {
        filter: 'id = "' + userId + '"',
        maxRecords: 1,
      });
      if (userRecords.records.length > 0) {
        publicReference = (userRecords.records[0].fields.public_reference as string) || '';
      }
    } catch (e) {
      console.warn('Failed to fetch user public reference:', e);
    }

    // Set session cookie
    return jsonResponse(response, 200, {
      authenticated: true,
      userId,
      public_reference: publicReference,
      roles: ['member'],
      businessOwnerships: [],
      staffAssignments: [],
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    });
  } catch (error: any) {
    console.error('OTP verify error:', error?.message || error);
    return jsonResponse(response, 500, { ok: false, code: 'INTERNAL_ERROR', error: error?.message || 'Unknown error' });
  }
}

function getEmailHash(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}