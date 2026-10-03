export default function handler(
  request: { method: string },
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (body: object) => void };
  }
): void {
  if (request.method === 'GET') {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ ok: true });
    return;
  }

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Allow', 'GET');
  response.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });
}
