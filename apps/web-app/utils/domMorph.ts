// Minimal real DOM morphing with DOM-diff and patching (not just replace all)
import morphdom from "morphdom";

export function morphDom(target: HTMLElement, nextHtml: string) {
  const temp = document.createElement("div");
  temp.innerHTML = nextHtml;
  // Use morphdom: https://github.com/patrick-steele-idem/morphdom
  morphdom(target, temp, {
    onBeforeNodeAdded: () => true,
    onNodeDiscarded: () => true,
    onBeforeElUpdated: () => true,
    childrenOnly: true
  });
}