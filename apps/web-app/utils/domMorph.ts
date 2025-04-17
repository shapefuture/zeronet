let lastMorphDuration = 0;
export function getLastMorphDuration() { return lastMorphDuration; }

import morphdom from 'morphdom';

export function morphDom(target: HTMLElement, nextHtml: string) {
  if (!target) return false;
  const temp = document.createElement("div");
  temp.innerHTML = nextHtml;
  const t0 = performance.now();
  morphdom(target, temp, {
    childrenOnly: true,
    onBeforeElUpdated: (fromEl, toEl) =>
      (fromEl.isEqualNode && fromEl.isEqualNode(toEl)) ? false : true,
    getNodeKey: node =>
      (node.nodeType === 1 && (node as any).getAttribute('data-morph-key')) || undefined
  });
  lastMorphDuration = performance.now() - t0;
  return true;
}