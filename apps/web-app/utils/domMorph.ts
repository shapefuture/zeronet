// DOM morphing utility (super simple for demo)
// In production, would use a real diff/morph algo

export function morphDom(target: HTMLElement, nextHtml: string) {
  // Replace only changed children
  const temp = document.createElement("div");
  temp.innerHTML = nextHtml;
  while (target.firstChild) target.removeChild(target.firstChild);
  while (temp.firstChild) target.appendChild(temp.firstChild);
}