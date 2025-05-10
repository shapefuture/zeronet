import morphdom from 'morphdom';
import { log, LogLevel } from './logger';

let lastMorphDuration = 0;
export function getLastMorphDuration() { return lastMorphDuration; }

export function morphDom(target: HTMLElement, nextHtml: string) {
  if (!target) {
    log(LogLevel.ERROR, "morphDom called with null target", { nextHtml });
    return false;
  }
  const temp = document.createElement("div");
  temp.innerHTML = nextHtml;
  const t0 = performance.now();
  try {
    log(LogLevel.DEBUG, "Starting DOM morph", { target, nextHtml });
    morphdom(target, temp, {
      childrenOnly: true,
      onBeforeElUpdated: (fromEl, toEl) => {
        const shouldSkip = fromEl.isEqualNode && fromEl.isEqualNode(toEl);
        if (shouldSkip) log(LogLevel.DEBUG, "Skipping unchanged node", fromEl);
        return !shouldSkip;
      },
      getNodeKey: node =>
        (node.nodeType === 1 && (node as any).getAttribute('data-morph-key')) || undefined
    });
    lastMorphDuration = performance.now() - t0;
    log(LogLevel.INFO, `DOM morph completed in ${lastMorphDuration} ms`);
    return true;
  } catch (e) {
    log(LogLevel.ERROR, "DOM morphing failed", e, { target, nextHtml });
    return false;
  }
}
