import { getTeableClient, Filter } from '../../../lib/teable.js';
import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import { parseJsonBody, jsonResponse, ParsedBody } from '../../../lib/node-helpers.js';

const OTP_TABLE_ID = process.env.TEABLE_OTP_TABLE_ID;
if (!OTP_TABLE_ID) {
  throw new Error('TEABLE_OTP_TABLE_ID environment variable is required');
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function hashOTP(code: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

function getEmailHash(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

async function sendOTPEmail(email: string, code: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'PlayaVida <support@playavida.org>',
      to: email,
      reply_to: process.env.EMAIL_REPLY_TO || 'support@playavida.org',
      subject: 'Tu codigo de acceso a PlayaVida',
      html: '<p>Tu codigo es: ' + code + '</p>',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Resend API error: ' + response.status + ' ' + error);
  }
}

interface RequestOtpBody extends ParsedBody {
  email?: unknown;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  let body: RequestOtpBody;
  try {
    body = await parseJsonBody<RequestOtpBody>(req);
  } catch (e: any) {
    if (e.message === 'EMPTY_BODY' || e.message === 'INVALID_JSON' || e.message === 'BODY_TOO_LARGE') {
      return jsonResponse(res, 400, { ok: false, code: 'INVALID_JSON' });
    }
    return jsonResponse(res, 400, { ok: false, code: 'INVALID_JSON' });
  }
  const email = String(body.email ?? '').toLowerCase().trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(res, 400, { ok: false, code: 'INVALID_EMAIL' });
  }

  let teable;
  try {
    teable = getTeableClient();
  } catch (e: any) {
    console.error('Teable client init failed:', e?.message || e);
    return jsonResponse(res, 500, { ok: false, code: 'TEABLE_CONFIG_ERROR', error: e?.message || 'Teable configuration error' });
  }

  const emailHash = getEmailHash(email);
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

try {
    const recentOTPs = await teable.listRecords(OTP_TABLE_ID, {
      filter: { fieldId: 'email_hash', operator: 'is', value: emailHash },
      maxRecords: 10,
    });

    if (recentOTPs.records.length >= 5) {
      return jsonResponse(res, 429, { ok: false, code: 'RATE_LIMITED' });
    }
  } catch (e: any) {
    console.warn('OTP rate limit check failed:', e?.message || e);
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');
  const codeHash = salt + ':' + hash;
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

  try {
    await teable.createRecord(OTP_TABLE_ID, {
      email_hash: getEmailHash(email),
      code_hash: codeHash,
      expires_at: expiresAt.toISOString(),
      attempt_count: 0,
      status: 'issued',
      created_at: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error('Failed to store OTP:', e?.message || e);
    return jsonResponse(res, 500, { ok: false, code: 'OTP_STORE_FAILED', error: e?.message || 'Unknown error' });
  }

  try {
    await sendOTPEmail(email, code);
  } catch (e: any) {
    console.error('Failed to send OTP email:', e?.message || e);
    return jsonResponse(res, 500, { ok: false, code: 'EMAIL_SEND_FAILED', error: e?.message || 'Unknown error' });
  }

  return jsonResponse(res, 200, { ok: true });
}
