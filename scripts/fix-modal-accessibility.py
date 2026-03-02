#!/usr/bin/env python3
"""
Fix modal accessibility issues by adding role="presentation" to backdrop overlays
and role="dialog" to modal content.
"""

import re
from pathlib import Path

def fix_modal_patterns(content: str) -> tuple[str, int]:
    """
    Fix modal accessibility patterns.
    Returns: (modified_content, num_fixes)
    """
    fixes = 0

    # Pattern 1: Backdrop overlay with onClick (fixed inset-0, bg-black, onClick)
    # Match: <div ... className="...fixed...inset-0...bg-black..." onClick={...}>
    # That doesn't already have role=
    backdrop_pattern = re.compile(
        r'(<div\s+[^>]*className="[^"]*(?:fixed|absolute)[^"]*inset-0[^"]*bg-black[^"]*"[^>]*onClick=\{[^}]+\}[^>]*)(?<!role=")>',
        re.MULTILINE | re.DOTALL
    )

    def add_backdrop_role(match):
        nonlocal fixes
        opening_tag = match.group(1)
        # Check if it already has role=
        if 'role=' in opening_tag:
            return match.group(0)
        fixes += 1
        # Add role="presentation" before the closing >
        return opening_tag + '\n          role="presentation"\n        >'

    content = backdrop_pattern.sub(add_backdrop_role, content)

    # Pattern 2: Modal content div with onClick stopPropagation
    # Match: <div ... onClick={(e) => e.stopPropagation()}>
    # That doesn't already have role="dialog"
    modal_content_pattern = re.compile(
        r'(<div\s+[^>]*onClick=\{[^}]*stopPropagation[^}]*\}[^>]*)(?<!role=")>',
        re.MULTILINE | re.DOTALL
    )

    def add_dialog_role(match):
        nonlocal fixes
        opening_tag = match.group(1)
        # Check if it already has role=
        if 'role=' in opening_tag:
            return match.group(0)
        # Only add if it looks like a modal (has className with rounded/shadow/bg-white)
        if 'rounded' in opening_tag and ('bg-white' in opening_tag or 'shadow' in opening_tag):
            fixes += 1
            return opening_tag + '\n            role="dialog"\n            aria-modal="true"\n          >'
        return match.group(0)

    content = modal_content_pattern.sub(add_dialog_role, content)

    return content, fixes

def main():
    src_dir = Path('/Users/ronny/Desktop/Travelprov/src')
    total_fixes = 0
    files_modified = 0

    # Find all TSX files
    tsx_files = list(src_dir.rglob('*.tsx'))

    print(f"Found {len(tsx_files)} TSX files")
    print("Fixing modal accessibility patterns...\n")

    for tsx_file in tsx_files:
        try:
            content = tsx_file.read_text()
            new_content, fixes = fix_modal_patterns(content)

            if fixes > 0:
                tsx_file.write_text(new_content)
                total_fixes += fixes
                files_modified += 1
                print(f"✓ {tsx_file.relative_to(src_dir)}: {fixes} fixes")

        except Exception as e:
            print(f"✗ {tsx_file.relative_to(src_dir)}: Error - {e}")

    print(f"\n{'='*50}")
    print(f"Total: {total_fixes} modal patterns fixed in {files_modified} files")

if __name__ == '__main__':
    main()
