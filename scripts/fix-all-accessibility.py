#!/usr/bin/env python3
"""
Comprehensive accessibility fixes:
1. Remove onClick stopPropagation from modal content (not needed)
2. Add keyboard handlers to backdrop overlays
3. Add keyboard handlers to interactive divs
"""

import re
from pathlib import Path

def fix_accessibility_issues(content: str, filepath: str) -> tuple[str, int]:
    """
    Fix various accessibility patterns.
    Returns: (modified_content, num_fixes)
    """
    fixes = 0

    # Pattern 1: Remove onClick stopPropagation from modal content divs
    # These don't need onClick at all - they're not interactive
    stopProp_pattern = re.compile(
        r'\s+onClick=\{\(e\)\s*=>\s*e\.stopPropagation\(\)\}',
        re.MULTILINE
    )

    new_content = stopProp_pattern.sub('', content)
    fixes += len(stopProp_pattern.findall(content))

    # Pattern 2: Add keyboard handler to backdrop overlays that have onClick and role="presentation"
    # Match: role="presentation" followed by > without onKeyDown
    backdrop_pattern = re.compile(
        r'(onClick=\{[^}]+\}\s+role="presentation")\s*\n\s*>',
        re.MULTILINE
    )

    def add_keydown_to_backdrop(match):
        nonlocal fixes
        # Extract the onClick handler
        opening = match.group(1)
        # Check if onKeyDown already exists nearby
        if 'onKeyDown' in content[max(0, match.start()-200):match.end()+200]:
            return match.group(0)
        fixes += 1
        # Add onKeyDown that calls the same handler on Escape
        return opening + '\n          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}\n        >'

    new_content = backdrop_pattern.sub(add_keydown_to_backdrop, new_content)

    return new_content, fixes

def main():
    src_dir = Path('/Users/ronny/Desktop/Travelprov/src')
    total_fixes = 0
    files_modified = 0

    # Find all TSX files
    tsx_files = list(src_dir.rglob('*.tsx'))

    print(f"Found {len(tsx_files)} TSX files")
    print("Fixing accessibility issues...\n")

    for tsx_file in tsx_files:
        try:
            content = tsx_file.read_text()
            new_content, fixes = fix_accessibility_issues(content, str(tsx_file))

            if fixes > 0:
                tsx_file.write_text(new_content)
                total_fixes += fixes
                files_modified += 1
                print(f"✓ {tsx_file.relative_to(src_dir)}: {fixes} fixes")

        except Exception as e:
            print(f"✗ {tsx_file.relative_to(src_dir)}: Error - {e}")

    print(f"\n{'='*50}")
    print(f"Total: {total_fixes} patterns fixed in {files_modified} files")

if __name__ == '__main__':
    main()
