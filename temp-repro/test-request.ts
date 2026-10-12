// Minimal test to understand Vercel handler contract
// This file will be deleted after testing

// Test 1: What does a standard Request look like?
const testRequest = new Request('https://example.com/api/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'test@example.com' })
});

console.log('=== Standard Web Request ===');
console.log('Request type:', testRequest.constructor.name);
console.log('Has json():', typeof testRequest.json === 'function');
console.log('Has body:', typeof testRequest.body);
console.log('body type:', typeof testRequest.body);
console.log('body constructor:', testRequest.body?.constructor?.name);
console.log('Has headers.get:', typeof testRequest.headers.get === 'function');
console.log('Has headers:', typeof testRequest.headers);

// Test json() method
try {
  const json = await testRequest.json();
  console.log('json() result:', json);
} catch (e) {
  console.log('json() error:', e.message);
}

// Check body type
console.log('body is ReadableStream:', testRequest.body instanceof ReadableStream);
console.log('body is object:', typeof testRequest.body === 'object');
console.log('body is null:', testRequest.body === null);

// Test body consumption
const bodyUsed = testRequest.bodyUsed;
console.log('bodyUsed:', bodyUsed);

try {
  const text = await testRequest.text();
  console.log('text():', text);
} catch (e) {
  console.log('text() error:', e.message);
}

try {
  const json = await testRequest.json();
  console.log('json() after text():', json);
} catch (e) {
  console.log('json() after text() error:', e.message);
}

// Clean up
export {};