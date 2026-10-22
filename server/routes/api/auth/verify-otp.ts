import { H3Event } from 'h3';
import { getTeableClient } from '../../../lib/teable.js';
import crypto from 'crypto';

const OTP_TABLE_ID = process.env.TEABLE_OTP_TABLE_ID;
if (!OTP_TABLE_ID) {
  throw new Error('TEABLE_OTP_TABLE_ID environment variable is required');
}
const SESSIONS_TABLE_ID = process.env.TEABLE_SESSIONS_TABLE_ID;
if (!SESSIONS_TABLE_ID) {
  throw new Error('TEABLE_SESSIONS_TABLE_ID environment variable is required');
}
const USERS_TABLE_ID = process.env.TEABLE_TABLE_USERS || 'tblB6Wiwy4KOx3Tjgui';
const BUSINESSES_TABLE_ID = process.env.TEABLE_TABLE_BUSINESSES || 'tbl8IOboEGdwYHqJck2';
const STAFF_TABLE_ID = 'tblFemWKDqyaQtOqDCV';

function getEmailHash(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

export default async function handler(event: any): Promise<void> {
  const req = event.node.req;
  const res = event.node.res;

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, code: 'METHOD_NOT_ALLOWED' }));
    return;
  }

  let body: any;
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, 'utf8');
      chunks.push(buf);
    }
    const bodyBuffer = Buffer.concat(chunks);
    body = JSON.parse(bodyBuffer.toString('utf8'));
  } catch (e: any) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, code: 'INVALID_JSON' }));
    return;
  }

  const email = String(body.email ?? '').toLowerCase().trim();
  const code = String(body.code ?? '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, code: 'INVALID_EMAIL' }));
    return;
  }

  if (!code || !/^\d{6}$/.test(code)) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, code: 'INVALID_CODE' }));
    return;
  }

  let teable;
  try {
    teable = getTeableClient();
  } catch (e: any) {
    console.error('Teable client init failed:', e?.message || e);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, code: 'TEABLE_CONFIG_ERROR', error: e?.message || 'Teable configuration error' }));
    return;
  }

  const emailHash = getEmailHash(email);

  // Find valid OTP
  let otpRecord;
  try {
    const otpRecords = await teable.listRecords('tblVe1AhQ3zLW3eijnw', {
      filter: {
        conjunction: 'AND',
        conditions: [
          { fieldId: 'email_hash', operator: 'is', value: emailHash },
          { fieldId: 'status', operator: 'is', value: 'issued' },
        ],
      },
      maxRecords: 1,
      sort: '-created_at',
    });

    if (otpRecords.records.length === 0) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, code: 'INVALID_CODE' }));
      return;
    }

    otpRecord = otpRecords.records[0];
  } catch (e: any) {
    console.error('Failed to fetch OTP:', e?.message || e);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, code: 'OTP_FETCH_FAILED', error: e?.message || 'Unknown error' }));
    return;
  }

  const otpFields = otpRecord.fields as any;

  // Check attempts
  if ((otpFields.attempt_count || 0) >= 5) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 429;
    res.end(JSON.stringify({ ok: false, code: 'RATE_LIMITED' }));
    return;
  }

  // Verify OTP
  const storedHash = otpRecord.fields.code_hash as string;
  if (!storedHash) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, code: 'INVALID_CODE' }));
    return;
  }

  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');

  if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash))) {
    // Increment attempts
    await teable.updateRecord('tblVe1AhQ3zLW3eijnw', otpRecord.id as string, {
      attempt_count: (otpFields.attempt_count || 0) + 1,
    });

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, code: 'INVALID_CODE' }));
    return;
  }

  // Mark OTP as consumed
  await teable.updateRecord('tblVe1AhQ3zLW3eijnw', otpRecord.id as string, {
    status: 'consumed',
    consumed_at: new Date().toISOString(),
  });

  // Find or create user
  let userRecord;
  try {
    const userRecords = await teable.listRecords('tblB6Wiwy4KOx3Tjgui', {
      filter: { fieldId: 'email', operator: 'is', value: req.body.email },
      maxRecords: 1,
    });

    if (userRecords.records.length === 0) {
      // Create new user
      const newUser = await teable.createRecord('tblB6Wiwy4KOx3Tjgui', {
        email: req.body.email,
        role: 'member',
        created_at: new Date().toISOString(),
      });
      userRecord = newUser.records[0];
    } else {
      userRecord = userRecords.records[0];
    }
  } catch (e: any) {
    console.error('Failed to find/create user:', e?.message || e);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, code: 'USER_CREATE_FAILED', error: e?.message || 'Unknown error' }));
    return;
  }

  const userId = userRecord.id;

  // Fetch user's business ownerships
  let businessOwnerships: string[] = [];
  try {
    const bizRecords = await teable.listRecords('tbl8IOboEGdwYHqJck2', {
      filter: { fieldId: 'created_by_user_id', operator: 'is', value: userId },
      maxRecords: 100,
    });
    businessOwnerships = bizRecords.records.map(r => r.id as string);
  } catch (e) {
    console.warn('Failed to fetch business ownerships:', e);
  }

  // Fetch user's staff assignments
  let staffAssignments: any[] = [];
  try {
    const staffRecords = await teable.listRecords('tblFemWKDqyaQtOqDCV', {
      filter: { fieldId: 'user_id', operator: 'is', value: userId },
      maxRecords: 100,
    });
    staffAssignments = staffRecords.records.map(r => ({
      businessId: r.fields.business_id as string,
      role: r.fields.role as string,
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
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, code: 'SESSION_CREATE_FAILED', error: e?.message || 'Unknown error' }));
    return;
  }

  // Get user public reference
  let publicReference = '';
  try {
    const userRecords = await teable.listRecords('tblB6Wiwy4KOx3Tjgui', {
      filter: { fieldId: 'id', operator: 'is', value: userId },
      maxRecords: 1,
    });
    if (userRecords.records.length > 0) {
      publicReference = (userRecords.records[0].fields.public_reference as string) || '';
    }
  } catch (e) {
    console.warn('Failed to fetch user public reference:', e);
  }

  // Set session cookie
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({
    authenticated: true,
    userId,
    public_reference: publicReference,
    roles: ['member'],
    businessOwnerships: [],
    staffAssignments: [],
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  }));
}