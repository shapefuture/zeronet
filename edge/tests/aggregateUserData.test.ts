import { default as aggregateUserData } from '../aggregateUserData';
test('Aggregates profile and preferences', async () => {
  const req = new Request('https://worker.com?id=42');
  const resp = await aggregateUserData.fetch(req, {}, {});
  const json = await resp.json();
  expect(json).toHaveProperty('profile');
  expect(json).toHaveProperty('preferences');
  expect(json.id).toBe('42');
});