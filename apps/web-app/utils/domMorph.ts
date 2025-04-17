import morphdom from 'morphdom';

export function morphDom(target: HTMLElement, nextHtml: string) {
  if (!target) return false;
  const temp = document.createElement("div");
  temp.innerHTML = nextHtml;
  // Use morphdom with key and onBeforeElUpdated logic
  return morphdom(target, temp, {
    childrenOnly: true,
    onBeforeElUpdated: (fromEl, toEl) => {
      // Only swap if actual node structure/attributes differ
      if (fromEl.isEqualNode && fromEl.isEqualNode(toEl)) return false;
      return true;
    },
    getNodeKey: node => (node.nodeType === 1 && (node as any).getAttribute('data-morph-key')) || undefined
  });
}