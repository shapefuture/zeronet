def binary_diff(snapshot_a: bytes, snapshot_b: bytes) -> bytes:
    # Trivial binary diff (xor); real world would be more sophisticated (bsdiff, etc)
    length = min(len(snapshot_a), len(snapshot_b))
    patch = bytes([a ^ b for a, b in zip(snapshot_a[:length], snapshot_b[:length])])
    return patch

def structural_diff(html_a: str, html_b: str) -> str:
    # Very basic structural diff - return only changed lines
    a_lines = set(html_a.splitlines())
    b_lines = set(html_b.splitlines())
    diff_lines = b_lines - a_lines
    return "\n".join(diff_lines)