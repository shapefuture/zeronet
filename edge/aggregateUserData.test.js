import handler from "./aggregateUserData.js";

test('returns error on invalid user ID', async () => {
  const request = new Request('https://worker/?id=bad');
  const resp = await handler.fetch(request, {}, {});
  expect(resp.status).toBe(400);
});
test('returns error if upstream fails', async () => {
  const request = new Request('https://worker/?id=999999');
  // Mock fetch to simulate upstream failure
  globalThis.fetch = async () => ({ ok: false, json: async () => ({}) });
  const resp = await handler.fetch(request, {}, {});
  expect(resp.status).toBe(502);
});