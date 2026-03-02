#!/usr/bin/env python3
"""
Script to automatically add htmlFor attributes to <label> elements and id attributes to their associated inputs.
"""

import re
import sys
from pathlib import Path

def generate_id_from_label(label_text):
    """Generate a camelCase id from label text."""
    # Remove special characters and Hebrew, keep English words
    words = re.findall(r'[a-zA-Z]+', label_text)
    if not words:
        return None
    # Convert to camelCase
    return words[0].lower() + ''.join(w.capitalize() for w in words[1:])

def fix_label_in_file(file_path):
    """Fix labels in a single file."""
    content = Path(file_path).read_text(encoding='utf-8')
    lines = content.split('\n')

    modified = False
    i = 0
    while i < len(lines):
        line = lines[i]

        # Look for <label> without htmlFor
        if '<label' in line and 'htmlFor=' not in line and not line.strip().startswith('//'):
            # Find the label text
            label_match = re.search(r'<label[^>]*>([^<]+)', line)
            if label_match:
                label_text = label_match.group(1).strip()

                # Generate an ID
                field_id = generate_id_from_label(label_text)
                if not field_id:
                    # Use a generic ID based on line number
                    field_id = f'field_{i}'

                # Add htmlFor to the label
                lines[i] = re.sub(r'<label', f'<label htmlFor="{field_id}"', line)
                modified = True

                # Look for the next input/select/textarea within the next 10 lines
                for j in range(i + 1, min(i + 15, len(lines))):
                    next_line = lines[j]

                    # Check for input, select, or textarea
                    if re.search(r'<(input|select|textarea|Input|Select|Textarea)', next_line):
                        # Add id if not present
                        if 'id=' not in next_line and 'id =' not in next_line:
                            # Find the tag
                            tag_match = re.search(r'<(input|select|textarea|Input|Select|Textarea)([^>]*)', next_line)
                            if tag_match:
                                tag_name = tag_match.group(1)
                                attrs = tag_match.group(2)

                                # Insert id after the tag name
                                lines[j] = next_line.replace(
                                    f'<{tag_name}',
                                    f'<{tag_name} id="{field_id}"',
                                    1
                                )
                                modified = True
                        break

        i += 1

    if modified:
        Path(file_path).write_text('\n'.join(lines), encoding='utf-8')
        print(f"✓ Fixed {file_path}")
        return True
    return False

def main():
    files = [
        'src/app/components/ClassificationWizard.tsx',
        'src/app/components/DocumentsPage.tsx',
        'src/app/components/FormField.tsx',
        'src/app/components/ImportWizard.tsx',
        'src/app/components/ItemEditor.tsx',
        'src/app/components/KanbanBoard.tsx',
        'src/app/components/ProductEditor.tsx',
        'src/app/components/SupplierBank.tsx',
        'src/app/components/SupplierDetail.tsx',
        'src/app/components/SupplierSearch.tsx',
    ]

    base_dir = Path(__file__).parent.parent
    fixed_count = 0

    for file_rel in files:
        file_path = base_dir / file_rel
        if file_path.exists():
            if fix_label_in_file(file_path):
                fixed_count += 1
        else:
            print(f"✗ File not found: {file_path}")

    print(f"\nFixed {fixed_count} files")

if __name__ == '__main__':
    main()
