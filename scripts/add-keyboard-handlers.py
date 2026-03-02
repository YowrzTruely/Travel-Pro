#!/usr/bin/env python3
"""
Add keyboard handlers to interactive divs that have onClick but no keyboard support.
This makes them accessible via keyboard (Enter/Space keys).
"""

import re
from pathlib import Path

def add_keyboard_handlers(content: str) -> tuple[str, int]:
    """
    Add keyboard handlers to divs with onClick.
    Returns: (modified_content, num_fixes)
    """
    fixes = 0

    # Pattern: div with onClick that doesn't have onKeyDown
    # Look for: <div ... onClick={...}> where there's no onKeyDown nearby
    # This is complex, so we'll do it in multiple passes

    lines = content.split('\n')
    result_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Check if this line has a div opening tag with onClick
        if '<div' in line and 'onClick=' in line and not 'onKeyDown' in line:
            # Check next few lines to see if onKeyDown is there
            has_keydown = False
            for j in range(i, min(i + 5, len(lines))):
                if 'onKeyDown' in lines[j] or 'role="presentation"' in lines[j] or 'role="dialog"' in lines[j]:
                    has_keydown = True
                    break

            if not has_keydown and 'cursor-pointer' in line:
                # This is an interactive div that needs keyboard support
                # Find the closing > of the opening tag
                closing_line_idx = i
                for j in range(i, min(i + 10, len(lines))):
                    if '>' in lines[j] and not '/>' in lines[j]:
                        closing_line_idx = j
                        break

                # Extract the onClick handler
                onclick_match = re.search(r'onClick=\{([^}]+(?:\{[^}]*\})*[^}]*)\}', '\n'.join(lines[i:closing_line_idx+1]))
                if onclick_match:
                    # Add keyboard handler before the closing >
                    closing_line = lines[closing_line_idx]
                    if closing_line.strip().endswith('>') and not closing_line.strip().endswith('/>'):
                        indent = len(closing_line) - len(closing_line.lstrip())
                        keyboard_handler = ' ' * indent + f'onKeyDown={{(e) => {{ if (e.key === \'Enter\' || e.key === \' \') {{ e.preventDefault(); ({onclick_match.group(1)})(); }} }}}}'
                        role_attr = ' ' * indent + 'role="button"'
                        tabindex_attr = ' ' * indent + 'tabIndex={0}'

                        # Insert before closing >
                        new_closing = closing_line.replace('>', f'\n{keyboard_handler}\n{role_attr}\n{tabindex_attr}\n{" " * indent}>')
                        lines[closing_line_idx] = new_closing
                        fixes += 1

        result_lines.append(lines[i])
        i += 1

    return '\n'.join(result_lines), fixes

def main():
    src_dir = Path('/Users/ronny/Desktop/Travelprov/src')
    total_fixes = 0
    files_modified = 0

    # Target files with most errors
    target_files = [
        'app/components/SupplierDetail.tsx',
        'app/components/QuoteEditor.tsx',
        'app/components/Layout.tsx',
        'app/components/ItemEditor.tsx',
        'app/components/ProductEditor.tsx',
        'app/components/calendar/WeeklyView.tsx',
        'app/components/calendar/MonthlyView.tsx',
    ]

    print("Adding keyboard handlers to interactive elements...\n")

    for rel_path in target_files:
        tsx_file = src_dir / rel_path
        if not tsx_file.exists():
            continue

        try:
            content = tsx_file.read_text()
            new_content, fixes = add_keyboard_handlers(content)

            if fixes > 0:
                tsx_file.write_text(new_content)
                total_fixes += fixes
                files_modified += 1
                print(f"✓ {rel_path}: {fixes} fixes")

        except Exception as e:
            print(f"✗ {rel_path}: Error - {e}")

    print(f"\n{'='*50}")
    print(f"Total: {total_fixes} keyboard handlers added in {files_modified} files")

if __name__ == '__main__':
    main()
