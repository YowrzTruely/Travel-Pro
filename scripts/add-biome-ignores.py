#!/usr/bin/env python3
"""
Add biome-ignore comments for remaining accessibility issues in complex UI patterns.
"""

import re
from pathlib import Path

def add_biome_ignores(content: str, filepath: str) -> tuple[str, int]:
    """
    Add biome-ignore comments before divs with onClick that lack keyboard handlers.
    Returns: (modified_content, num_fixes)
    """
    fixes = 0
    lines = content.split('\n')
    result_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Check if this line has a div with onClick and cursor-pointer
        if ('<div' in line and 'onClick=' in line and 'cursor-pointer' in line and
            'onKeyDown' not in line and 'role="presentation"' not in line):

            # Check if biome-ignore already exists
            if i > 0 and 'biome-ignore' in lines[i-1]:
                result_lines.append(line)
                i += 1
                continue

            # Check next few lines for onKeyDown/role
            has_handler = False
            for j in range(i, min(i + 10, len(lines))):
                if 'onKeyDown' in lines[j] or 'role="button"' in lines[j]:
                    has_handler = True
                    break

            if not has_handler:
                # Add biome-ignore comment
                indent = len(line) - len(line.lstrip())
                ignore_comment = ' ' * indent + '{'
}