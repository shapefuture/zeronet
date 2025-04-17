import difflib

def binary_diff(snapshot_a: bytes, snapshot_b: bytes) -> bytes:
    # Using a real binary diff: output indices where bytes are different
    patch = []
    for i, (a_byte, b_byte) in enumerate(zip(snapshot_a, snapshot_b)):
        if a_byte != b_byte:
            patch.append((i, b_byte))
    return bytes([item for pair in patch for item in pair])

def structural_diff(html_a: str, html_b: str) -> str:
    diff = difflib.unified_diff(
        html_a.splitlines(keepends=True),
        html_b.splitlines(keepends=True),
        fromfile='snapshot_a.html',
        tofile='snapshot_b.html'
    )
    return ''.join(diff)