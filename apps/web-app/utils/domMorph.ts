import morphdom from 'morphdom';
import { logVerbose, logError } from './verboseLogger';

let lastMorphDuration = 0;
export function getLastMorphDuration() { return lastMorphDuration; }

export function morphDom(target: HTMLElement, nextHtml: string) {
  if (!target) {
    logError("morphDom called with null/undefined target");
    return false;
  }
  const temp = document.createElement("div");
  temp.innerHTML = nextHtml;
  try {
    const t0 = performance.now();
    morphdom(target, temp, {
      childrenOnly: true,
      onBeforeElUpdated: (fromEl, toEl) =>
        (fromEl.isEqualNode && fromEl.isEqualNode(toEl)) ? false : true,
      getNodeKey: node =>
        (node.nodeType === 1 && (node as any).getAttribute('data-morph-key')) || undefined
    });
    lastMorphDuration = performance.now() - t0;
    logVerbose(`Morph duration: ${lastMorphDuration}ms`, {target, nextHtml});
    return true;
  } catch (err) {
    logError("morphDom failed", err, { target, nextHtml });
    return false;
  }
}
