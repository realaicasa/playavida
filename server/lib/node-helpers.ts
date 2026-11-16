import { readBody, HTTPResponse, setResponseHeader } from 'h3';

export interface ParsedBody {
  [key: string]: unknown;
}

export const MAX_BODY_BYTES = 1024 * 1024; // 1 MiB

export function getCookieHeader(event: any): string {
  const cookie = (event.req?.headers?.cookie) || (typeof event.headers?.get === 'function' ? event.headers.get('cookie') : '') || '';
  return cookie;
}

export async function parseJsonBody<T extends ParsedBody = ParsedBody>(event: any): Promise<T> {
  const parsed = await readBody<T>(event);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('INVALID_JSON');
  }
  return parsed;
}

export function jsonResponse(event: any, status: number, body: object): HTTPResponse {
  return new HTTPResponse(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function setSessionCookie(event: any, sessionId: string, maxAgeSeconds: number): void {
  const cookie = `session_id=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
  setResponseHeader(event, 'Set-Cookie', cookie);
}

export function clearSessionCookie(event: any): void {
  const cookie = 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
  setResponseHeader(event, 'Set-Cookie', cookie);
}