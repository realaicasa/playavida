import type { IncomingMessage, ServerResponse } from 'http';

export interface ParsedBody {
  [key: string]: unknown;
}

export const MAX_BODY_BYTES = 1024 * 1024; // 1 MiB

export function getCookieHeader(req: IncomingMessage): string {
  return req.headers.cookie || '';
}

export function getHeader(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function parseJsonBody<T extends ParsedBody = ParsedBody>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let settled = false;

    const cleanup = () => {
      req.removeListener('data', onData);
      req.removeListener('end', onEnd);
      req.removeListener('error', onError);
    };

    const settle = (result: Promise<T>) => {
      if (settled) return;
      settled = true;
      cleanup();
      result.then(resolve, reject);
    };

    const onData = (chunk: Buffer | string) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, 'utf8');
      totalBytes += buf.length;
      if (totalBytes > MAX_BODY_BYTES) {
        settle(Promise.reject(new Error('BODY_TOO_LARGE')));
        return;
      }
      chunks.push(buf);
    };

    const onEnd = () => {
      if (totalBytes === 0) {
        settle(Promise.reject(new Error('EMPTY_BODY')));
        return;
      }
      const bodyBuffer = Buffer.concat(chunks, totalBytes);
      try {
        const parsed = JSON.parse(bodyBuffer.toString('utf8'));
        if (typeof parsed !== 'object' || parsed === null) {
          settle(Promise.reject(new Error('INVALID_JSON')));
          return;
        }
        settle(Promise.resolve(parsed as T));
      } catch {
        settle(Promise.reject(new Error('INVALID_JSON')));
      }
    };

    const onError = (err: Error) => {
      settle(Promise.reject(err));
    };

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);
  });
}

export function jsonResponse(res: ServerResponse, status: number, body: object): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

export function setSessionCookie(res: ServerResponse, sessionId: string, maxAgeSeconds: number): void {
  const cookie = `session_id=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
  res.setHeader('Set-Cookie', cookie);
}

export function clearSessionCookie(res: ServerResponse): void {
  const cookie = 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
  res.setHeader('Set-Cookie', cookie);
}