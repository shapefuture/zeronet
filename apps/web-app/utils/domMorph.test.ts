import { morphDom, getLastMorphDuration } from './domMorph';

describe('morphDom', () => {
  it('updates only changed child nodes in the DOM and logs timing', () => {
    document.body.innerHTML = `<div id="root"><span data-morph-key="a">A</span><span data-morph-key="b">B</span></div>`;
    const target = document.getElementById('root')!;
    const html = `<span data-morph-key="a">A</span><span data-morph-key="b">BB</span>`;
    const result = morphDom(target, html);
    expect(result).toBe(true);
    expect(target.querySelector('[data-morph-key="b"]')?.textContent).toBe('BB');
    expect(target.querySelectorAll('span').length).toBe(2);
    expect(getLastMorphDuration()).toBeGreaterThan(0);
  });
  it('logs and returns false on null target', () => {
    // @ts-expect-error purposely wrong
    expect(morphDom(null, "<div></div>")).toBe(false);
  });
});
