import { getTeableClient } from '../lib/teable';
import crypto from 'crypto';

const OTP_TABLE_ID = process.env.TEABLE_TABLE_OTP || 'tbl_otp_codes'; // To be configured
const OTP_TTL_MINUTES = parseInt(process.env.OTP_TTL_MINUTES || '10', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
const OTP_MAX_SENDS_PER_HOUR = parseInt(process.env.OTP_MAX_SENDS_PER_HOUR || '5', 10);
const OTP_MAX_VERIFY_ATTEMPTS = parseInt(process.env.OTP_MAX_VERIFY_ATTEMPTS || '5', 10);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'PlayaVida <support@playavida.org>';
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@playavida.org';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function hashOTP(code: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function verifyOTPHash(code: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
}

function getEmailHash(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

async function sendOTPEmail(email: string, code: string): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: email,
      reply_to: EMAIL_REPLY_TO,
      subject: 'Tu código de acceso a PlayaVida',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0d9488;">PlayaVida</h1>
          <p>Tu código de acceso es:</p>
          <div style="background: #f0fdfa; border: 2px solid #0d9488; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #0d9488; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">Este código expira en 10 minutos. No lo compartas con nadie.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #94a3b8; font-size: 12px;">Si no solicitaste este código, ignora este mensaje.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} ${error}`);
  }
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

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      response.setHeader('Content-Type', 'application/json');
      response.status(400).json({ ok: false, code: 'INVALID_EMAIL' });
      return;
    }

    const teable = getTeableClient();
    const emailHash = getEmailHash(email);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Rate limiting: check recent OTP requests for this email
    try {
      const recentOTPs = await teable.listRecords('tbl_otp_codes', {
        filter: `email_hash = "${emailHash}" AND created_time >= "${oneHourAgo.toISOString()}"`,
        maxRecords: 10,
      });

      if (recentOTPs.records.length >= 5) {
        response.setHeader('Content-Type', 'application/json');
        response.status(429).json({ ok: false, code: 'RATE_LIMITED' });
        return;
      }
    } catch (e) {
      // Table might not exist yet, continue anyway
      console.warn('OTP rate limit check failed:', e);
    }

    // Generate OTP
    const code = generateOTP();
    const codeHash = await hashOTP(code);
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Teable
    try {
      await teable.createRecord('tbl_otp_codes', {
        email_hash: getEmailHash(email),
        code_hash: codeHash,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        used: false,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to store OTP:', e);
      // Don't expose internal errors
    }

    // Send email (non-blocking - don't fail if email fails)
    try {
      await sendOTPEmail(email, code);
    } catch (e) {
      console.error('Failed to send OTP email:', e);
      // In production, you might want to handle this differently
    }

    // Always return success to prevent email enumeration
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error('OTP request error:', error);
    response.setHeader('Content-Type', 'application/json');
    response.status(500).json({ ok: false, code: 'INTERNAL_ERROR' });
  }
}