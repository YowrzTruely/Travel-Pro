#!/usr/bin/env python3
"""
Script to automatically add <title> elements to all <svg> elements for accessibility.
"""

import re
import sys
from pathlib import Path

def add_title_to_svg(content, file_path):
    """Add <title> elements to SVG tags that don't have them."""
    lines = content.split('\n')
    modified = False
    i = 0

    while i < len(lines):
        line = lines[i]

        # Check if this line contains an opening <svg tag
        if '<svg' in line and not line.strip().startswith('//'):
            # Check if there's already a <title> in the next few lines
            has_title = False
            for j in range(i, min(i + 5, len(lines))):
                if '<title>' in lines[j]:
                    has_title = True
                    break
                # If we hit a closing tag or another opening tag, stop looking
                if j > i and ('<svg' in lines[j] or '</svg>' in lines[j]):
                    break

            if not has_title:
                # Find where to insert the title
                # Look for the end of the opening <svg> tag
                svg_close_idx = i
                for j in range(i, min(i + 10, len(lines))):
                    if '>' in lines[j]:
                        svg_close_idx = j
                        break

                # Generate a descriptive title based on context
                title_text = generate_title(file_path, lines, i)

                # Get the indentation of the svg tag
                indent_match = re.match(r'^(\s*)', lines[svg_close_idx + 1] if svg_close_idx + 1 < len(lines) else lines[svg_close_idx])
                indent = indent_match.group(1) if indent_match else '      '

                # Add two more spaces for the title
                title_indent = indent + '  '

                # Insert the title after the opening svg tag
                title_line = f'{title_indent}<title>{title_text}</title>'
                lines.insert(svg_close_idx + 1, title_line)
                modified = True
                i = svg_close_idx + 2  # Skip past the inserted line
                continue

        i += 1

    if modified:
        return '\n'.join(lines)
    return None

def generate_title(file_path, lines, svg_line_idx):
    """Generate a descriptive title for an SVG based on context."""
    filename = Path(file_path).stem

    # Look for nearby text that might describe the icon
    context_before = ''.join(lines[max(0, svg_line_idx - 5):svg_line_idx])
    context_after = ''.join(lines[svg_line_idx:min(len(lines), svg_line_idx + 5)])

    # Common icon patterns
    if 'className' in context_before or 'className' in context_after:
        class_match = re.search(r'className=["\']([^"\']*)["\']', context_before + context_after)
        if class_match:
            classes = class_match.group(1)
            if 'close' in classes.lower():
                return 'Close icon'
            if 'menu' in classes.lower():
                return 'Menu icon'
            if 'search' in classes.lower():
                return 'Search icon'

    # Check for Lucide icon imports or components
    if 'Calendar' in context_before:
        return 'Calendar icon'
    if 'Search' in context_before:
        return 'Search icon'
    if 'Filter' in context_before:
        return 'Filter icon'
    if 'Plus' in context_before:
        return 'Add icon'
    if 'Edit' in context_before:
        return 'Edit icon'
    if 'Delete' in context_before or 'Trash' in context_before:
        return 'Delete icon'
    if 'Settings' in context_before:
        return 'Settings icon'
    if 'User' in context_before:
        return 'User icon'
    if 'Arrow' in context_before:
        return 'Arrow icon'
    if 'Check' in context_before:
        return 'Check icon'
    if 'X' in context_before or 'Close' in context_before:
        return 'Close icon'

    # Figma imports
    if filename.startswith('svg-'):
        return 'Decorative graphic'

    # Hebrew file names
    if any(ord(c) >= 0x0590 and ord(c) <= 0x05FF for c in filename):
        return 'Interface icon'

    # Default based on file type
    if 'components/ui/' in file_path:
        return 'UI icon'
    if 'CategoryIcons' in file_path:
        return 'Category icon'

    return 'Decorative icon'

def main():
    base_dir = Path(__file__).parent.parent

    # Find all TSX files
    tsx_files = list(base_dir.glob('src/**/*.tsx'))

    fixed_count = 0
    error_count = 0

    for file_path in tsx_files:
        try:
            content = file_path.read_text(encoding='utf-8')
            new_content = add_title_to_svg(content, str(file_path))

            if new_content:
                file_path.write_text(new_content, encoding='utf-8')
                fixed_count += 1
                print(f'✓ Fixed {file_path.relative_to(base_dir)}')
        except Exception as e:
            print(f'✗ Error processing {file_path}: {e}')
            error_count += 1

    print(f'\n✓ Fixed {fixed_count} files')
    if error_count > 0:
        print(f'✗ {error_count} files had errors')

if __name__ == '__main__':
    main()
