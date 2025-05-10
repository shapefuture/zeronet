import handler from "./aggregateUserData.js";

test('returns error on invalid user ID', async () => {
  const request = new Request('https://worker/?id=bad');
  const resp = await handler.fetch(request, {}, {});
  expect(resp.status).toBe(400);
});
test('returns error if upstream fails', async () => {
  const request = new Request('https://worker/?id=999999');
  globalThis.fetch = async () => ({ ok: false, json: async () => ({}) });
  const resp = await handler.fetch(request, {}, {});
  expect(resp.status).toBe(502);
});
test('logs verbose aggregation', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ displayName: "Test", avatarUrl: "A", theme: "dark", enableNotifications: true })
  });
  const request = new Request('https://worker/?id=123');
  const resp = await handler.fetch(request, {}, {});
  expect(resp.status).toBe(200);
  const json = await resp.json();
  expect(json.displayName).toBe("Test");
});
