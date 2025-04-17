def prune_dom(html: str) -> str:
    # Very basic example: remove elements by selector
    import re
    html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<.*?data-test-id=[\'"].*?[\'"].*?>.*?</.*?>', '', html, flags=re.DOTALL)
    return html