import { chromium } from '@playwright/test';
import readline from 'readline';

const BOARD_URL = 'https://miro.com/app/board/uXjVG5pK-04=/';

// All active diagram IDs on the board
const DIAGRAM_IDS = [
  // English Stack diagrams
  '3458764661507039072',  // Current Architecture (AS-IS)
  '3458764661518206410',  // MVP Architecture (TO-BE) NEW
  '3458764661507039826',  // Auth Flow Comparison
  '3458764661507204959',  // Data Flow
  '3458764661507205065',  // Payment Flow
  '3458764661507205242',  // Deployment Pipeline
  '3458764661507205410',  // Migration Roadmap
  // English Journey diagrams
  '3458764661508020758',  // Master Overview
  '3458764661518038914',  // Landing+Auth+Payment NEW
  '3458764661508312371',  // Supplier Management
  '3458764661508312637',  // Project+Quote
  '3458764661518206237',  // Operations NEW
  // Hebrew Stack diagrams
  '3458764661508840278',  // Current arch HE
  '3458764661517368347',  // MVP arch HE (recreated)
  '3458764661508840581',  // Auth HE
  '3458764661508840795',  // Data HE
  '3458764661509004052',  // Payment HE
  '3458764661509004276',  // Deploy HE
  '3458764661509004481',  // Migration HE
  // Hebrew Journey diagrams
  '3458764661509183257',  // Master HE
  '3458764661509183593',  // Landing+Auth HE
  '3458764661509351122',  // Supplier HE
  '3458764661509351701',  // Project+Quote HE
  '3458764661509518151',  // Operations HE
];

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('=== Miro Font Size Changer ===');
  console.log(`Will process ${DIAGRAM_IDS.length} diagrams\n`);

  // Launch browser with persistent profile so login is saved
  const userDataDir = 'C:/Users/User/.miro-playwright-profile';
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1920, height: 1080 },
  });

  const page = context.pages()[0] || await context.newPage();

  // Navigate to board
  console.log('Opening Miro board...');
  await page.goto(BOARD_URL);
  await sleep(5000);

  // Check if we need to log in
  await ask('\n>>> Log in to Miro if needed, then press ENTER to start automation...\n');

  // Phase 1: Explore the toolbar to find font size selector
  console.log('\n--- Phase 1: Discovering font size selector ---');
  await page.goto(`${BOARD_URL}?moveToWidget=${DIAGRAM_IDS[0]}`);
  await sleep(5000);

  // Click center to select diagram
  await page.mouse.click(960, 540);
  await sleep(1000);

  // Double-click to enter the diagram frame
  await page.mouse.dblclick(960, 540);
  await sleep(1000);

  // Select all inside
  await page.keyboard.press('Control+a');
  await sleep(2000);

  // Take screenshot for debugging
  await page.screenshot({ path: 'C:/Users/User/OneDrive/Desktop/TravelPro/Travelprov1/scripts/miro-toolbar.png' });

  // Find all potential font size elements in the DOM
  const fontInfo = await page.evaluate(() => {
    const results = [];

    // Strategy 1: Look for elements containing "14" text in toolbars
    document.querySelectorAll('[class*="toolbar"] *, [class*="Toolbar"] *, [class*="panel"] *, [data-testid]').forEach(el => {
      const text = el.textContent?.trim();
      if (text === '14' || text === '14px') {
        results.push({
          strategy: 'text-14',
          tag: el.tagName,
          class: el.className?.toString().substring(0, 100),
          testId: el.getAttribute('data-testid'),
          ariaLabel: el.getAttribute('aria-label'),
          role: el.getAttribute('role'),
          rect: el.getBoundingClientRect()
        });
      }
    });

    // Strategy 2: Look for font-size related attributes
    document.querySelectorAll('[data-testid*="font"], [data-testid*="size"], [aria-label*="font"], [aria-label*="Font"], [aria-label*="size"], [aria-label*="Size"]').forEach(el => {
      results.push({
        strategy: 'attr-font-size',
        tag: el.tagName,
        class: el.className?.toString().substring(0, 100),
        testId: el.getAttribute('data-testid'),
        ariaLabel: el.getAttribute('aria-label'),
        text: el.textContent?.trim().substring(0, 30),
        rect: el.getBoundingClientRect()
      });
    });

    // Strategy 3: Look for input or contenteditable elements near toolbars
    document.querySelectorAll('input[type="text"], input[type="number"], input:not([type]), [contenteditable="true"]').forEach(el => {
      const val = el.value || el.textContent;
      if (val && (val.includes('14') || val.includes('font'))) {
        results.push({
          strategy: 'input',
          tag: el.tagName,
          type: el.type,
          value: val,
          class: el.className?.toString().substring(0, 100),
          rect: el.getBoundingClientRect()
        });
      }
    });

    // Strategy 4: Look for any visible element with number "14"
    const allElements = document.querySelectorAll('button, span, div, input');
    allElements.forEach(el => {
      const text = el.textContent?.trim();
      const rect = el.getBoundingClientRect();
      if (text === '14' && rect.width > 0 && rect.height > 0 && rect.top < 200) {
        results.push({
          strategy: 'visible-14-top',
          tag: el.tagName,
          class: el.className?.toString().substring(0, 100),
          testId: el.getAttribute('data-testid'),
          rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
        });
      }
    });

    return results;
  });

  console.log('\nFound elements:', JSON.stringify(fontInfo, null, 2));

  // Try to identify the best selector
  let fontSizeSelector = null;

  for (const info of fontInfo) {
    if (info.testId?.includes('font') || info.testId?.includes('size')) {
      fontSizeSelector = `[data-testid="${info.testId}"]`;
      break;
    }
    if (info.ariaLabel?.toLowerCase().includes('font size')) {
      fontSizeSelector = `[aria-label="${info.ariaLabel}"]`;
      break;
    }
  }

  // If we found elements with "14" text at the top of the page (toolbar area)
  if (!fontSizeSelector) {
    const topElements = fontInfo.filter(f => f.strategy === 'visible-14-top');
    if (topElements.length > 0) {
      console.log('\nFound "14" text in toolbar area - will use click coordinates');
    }
  }

  console.log('\nFont size selector:', fontSizeSelector || 'Not found - will try coordinate-based approach');

  // Ask user to confirm
  const proceed = await ask('\n>>> Review the screenshot at scripts/miro-toolbar.png. Continue with automation? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    console.log('Aborting.');
    await context.close();
    process.exit(0);
  }

  // Phase 2: Process each diagram
  console.log('\n--- Phase 2: Changing font sizes ---');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < DIAGRAM_IDS.length; i++) {
    const diagramId = DIAGRAM_IDS[i];
    console.log(`\n[${i + 1}/${DIAGRAM_IDS.length}] Processing diagram: ${diagramId}`);

    try {
      // Navigate to diagram
      await page.goto(`${BOARD_URL}?moveToWidget=${diagramId}`);
      await sleep(4000);

      // Click center to select
      await page.mouse.click(960, 540);
      await sleep(800);

      // Double-click to enter frame
      await page.mouse.dblclick(960, 540);
      await sleep(800);

      // Select all
      await page.keyboard.press('Control+a');
      await sleep(1500);

      // Try to change font size
      let changed = false;

      // Method 1: Use discovered selector
      if (fontSizeSelector) {
        try {
          const el = await page.$(fontSizeSelector);
          if (el) {
            await el.click();
            await sleep(300);
            await page.keyboard.press('Control+a');
            await page.keyboard.type('80');
            await page.keyboard.press('Enter');
            changed = true;
          }
        } catch (e) {
          console.log('  Selector method failed:', e.message);
        }
      }

      // Method 2: Use coordinate-based approach - look for "14" in toolbar
      if (!changed) {
        const clickTarget = await page.evaluate(() => {
          const allElements = document.querySelectorAll('button, span, div, input');
          for (const el of allElements) {
            const text = el.textContent?.trim();
            const rect = el.getBoundingClientRect();
            if (text === '14' && rect.width > 0 && rect.height > 0 && rect.top < 200) {
              return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
            }
          }
          return null;
        });

        if (clickTarget) {
          await page.mouse.click(clickTarget.x, clickTarget.y);
          await sleep(500);
          // Triple-click to select all text in the field
          await page.mouse.click(clickTarget.x, clickTarget.y, { clickCount: 3 });
          await sleep(200);
          await page.keyboard.type('80');
          await page.keyboard.press('Enter');
          changed = true;
          console.log('  Used coordinate-based approach');
        }
      }

      // Method 3: Try finding any input with value "14"
      if (!changed) {
        const inputFound = await page.evaluate(() => {
          const inputs = document.querySelectorAll('input');
          for (const input of inputs) {
            if (input.value === '14' || input.value === '14px') {
              input.focus();
              input.value = '80';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
              input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
              return true;
            }
          }
          return false;
        });

        if (inputFound) {
          changed = true;
          console.log('  Used input injection approach');
        }
      }

      if (changed) {
        successCount++;
        console.log('  SUCCESS');
      } else {
        failCount++;
        console.log('  FAILED - could not find font size control');
      }

      // Escape to deselect
      await page.keyboard.press('Escape');
      await sleep(500);
      await page.keyboard.press('Escape');
      await sleep(500);

    } catch (err) {
      failCount++;
      console.log(`  ERROR: ${err.message}`);
    }
  }

  console.log(`\n=== Done! Success: ${successCount}, Failed: ${failCount} ===`);
  await ask('\n>>> Press ENTER to close browser...\n');
  await context.close();
})();
