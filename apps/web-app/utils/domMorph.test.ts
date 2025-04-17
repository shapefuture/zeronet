import { morphDom } from './domMorph';

describe('morphDom', () => {
  it('updates only changed child nodes in the DOM', () => {
    document.body.innerHTML = `<div id="root"><span data-morph-key="a">A</span><span data-morph-key="b">B</span></div>`;
    const target = document.getElementById('root')!;
    const html = `<span data-morph-key="a">A</span><span data-morph-key="b">BB</span>`;
    morphDom(target, html);
    expect(target.querySelector('[data-morph-key="b"]')?.textContent).toBe('BB');
    expect(target.querySelectorAll('span').length).toBe(2);
  });
});