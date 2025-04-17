from bs4 import BeautifulSoup

def prune_dom(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for selector in ["[hidden]", "script[type='application/ld+json']", "[data-test-id]"]:
        for el in soup.select(selector):
            el.decompose()
    return str(soup)