import { getTeableClient } from '../lib/teable';
import crypto from 'crypto';

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
      const recentOTPs = await teable.listRecords('tblVe1AhQ3zLW3eijnw', {
        filter: `email_hash = "${emailHash}" AND created_at >= "${oneHourAgo.toISOString()}"`,
        maxRecords: 10,
      });

      if (recentOTPs.records.length >= 5) {
        response.setHeader('Content-Type', 'application/json');
        response.status(429).json({ ok: false, code: 'RATE_LIMITED' });
        return;
      }
    } catch (e: any) {
      console.warn('OTP rate limit check failed:', e?.message || e);
      // Don't fail on rate limit check, just log it
    }

    // Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');
    const codeHash = `${salt}:${hash}`;
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Teable - using correct field names
    try {
      await teable.createRecord('tblVe1AhQ3zLW3eijnw', {
        email_hash: getEmailHash(email),
        code_hash: codeHash,
        expires_at: expiresAt.toISOString(),
        attempt_count: 0,
        status: 'issued',
        created_at: new Date().toISOString(),
      });
    } catch (e: any) {
      console.error('Failed to store OTP:', e?.message || e);
      response.setHeader('Content-Type', 'application/json');
      response.status(500).json({ ok: false, code: 'OTP_STORE_FAILED', error: e?.message || 'Unknown error' });
      return;
    }

    // Send email (non-blocking - don't fail if email fails)
    try {
      await sendOTPEmail(email, code);
    } catch (e: any) {
      console.error('Failed to send OTP email:', e?.message || e);
      response.setHeader('Content-Type', 'application/json');
      response.status(500).json({ ok: false, code: 'EMAIL_SEND_FAILED', error: e?.message || 'Unknown error' });
      return;
    }

    // Always return success to prevent email enumeration
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('OTP request error:', error?.message || error);
    response.setHeader('Content-Type', 'application/json');
    response.status(500).json({ ok: false, code: 'INTERNAL_ERROR', error: error?.message || 'Unknown error' });
  }
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function hashOTP(code: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(code, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
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
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'PlayaVida <support@playavida.org>',
      to: email,
      reply_to: process.env.EMAIL_REPLY_TO || 'support@playavida.org',
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