import { H3Event } from 'h3';

export default async function handler(event: H3Event): Promise<void> {
  const req = event.node.req;
  const res = event.node.res;

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 405;
  res.end(JSON.stringify({ ok: false, code: 'METHOD_NOT_ALLOWED' }));
}