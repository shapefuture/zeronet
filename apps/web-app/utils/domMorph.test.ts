import { morphDom, getLastMorphDuration } from './domMorph';

describe('morphDom', () => {
  it('updates only changed child nodes in the DOM', () => {
    document.body.innerHTML = `<div id="root"><span data-morph-key="a">A</span><span data-morph-key="b">B</span></div>`;
    const target = document.getElementById('root')!;
    const html = `<span data-morph-key="a">A</span><span data-morph-key="b">BB</span>`;
    expect(morphDom(target, html)).toBe(true);
    expect(target.querySelector('[data-morph-key="b"]')?.textContent).toBe('BB');
    expect(target.querySelectorAll('span').length).toBe(2);
    expect(getLastMorphDuration()).toBeGreaterThanOrEqual(0);
  });
  it('handles null target gracefully', () => {
    expect(morphDom(null as any, "<div></div>")).toBe(false);
  });
  it('logs errors on invalid HTML', () => {
    document.body.innerHTML = `<div id="root"></div>`;
    const target = document.getElementById('root')!;
    expect(morphDom(target, "<div><")).toBe(false);
  });
});
