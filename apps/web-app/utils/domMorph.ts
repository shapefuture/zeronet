// Enhanced DOM morphing with smart diffing and progressive enhancement

import morphdom from "morphdom";
import * as FlexSearch from "flexsearch";

// Smart DOM morphing with text node recovery/identity
export function morphDom(target: HTMLElement, nextHtml: string) {
  if (!target) return false;
  
  // Create temporary container
  const temp = document.createElement("div");
  temp.innerHTML = nextHtml;
  
  // Progressive enhancement for text content (fallback if morphdom fails)
  const extractTextContent = (el: HTMLElement) => {
    const textNodes: Record<string, string> = {};
    Array.from(el.querySelectorAll("[data-text-id]")).forEach(node => {
      const id = node.getAttribute("data-text-id");
      if (id) textNodes[id] = node.textContent || "";
    });
    return textNodes;
  };
  
  // Prioritize only updating changed content
  const onBeforeElUpdated = (fromEl: HTMLElement, toEl: HTMLElement) => {
    // Skip if identical by content/attrs
    if (fromEl.isEqualNode(toEl)) return false;
    
    // Only update changed attributes
    if (fromEl.tagName === toEl.tagName) {
      Array.from(toEl.attributes).forEach(attr => {
        if (fromEl.getAttribute(attr.name) !== attr.value) {
          fromEl.setAttribute(attr.name, attr.value);
        }
      });
      
      // If only attributes changed, don't replace the element
      if (fromEl.innerHTML === toEl.innerHTML) return false;
    }
    
    return true; // Continue with morphdom logic
  };
  
  try {
    // Try morphdom with optimization options
    morphdom(target, temp, {
      childrenOnly: true,
      onBeforeElUpdated,
      getNodeKey: (node: Node) => {
        if (node.nodeType !== 1) return null;
        return (node as HTMLElement).getAttribute("data-morph-key") || null;
      }
    });
  } catch (e) {
    console.warn("Morphdom failed, using fallback", e);
    
    // Fallback: Extract text from target, merge with new content
    const textContent = extractTextContent(target);
    const newTextContent = extractTextContent(temp);
    
    // Direct replacement (only as last resort)
    target.innerHTML = temp.innerHTML;
    
    // Restore text contents where possible
    Object.entries(textContent).forEach(([id, text]) => {
      const el = target.querySelector(`[data-text-id="${id}"]`);
      if (el && !newTextContent[id]) el.textContent = text;
    });
  }
  
  return true;
}

// Optional: IndexedDB-backed morph cache for repeat operations
let morphCache: any = null;
export async function initMorphCache() {
  try {
    morphCache = FlexSearch.create({
      encode: "advanced",
      tokenize: "full",
      cache: 100
    });
    console.log("Morph cache initialized");
  } catch (e) {
    console.warn("Morph cache init failed", e);
  }
}