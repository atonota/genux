import { expect, test, type Page, type TestInfo } from '@playwright/test';

async function evidence(page: Page, info: TestInfo, name: string) {
  await page.evaluate(() => document.fonts.ready);
  const record = await page.evaluate(() => {
    const selectors =
      '.docs-header, .sidebar, .shell-contents, .docs-page-tools, .page-neighbors, .shell-footer';
    const text: {
      text: string;
      size: number;
      family: string;
      color: string;
      background: string;
    }[] = [];
    for (const region of document.querySelectorAll(selectors)) {
      const walker = document.createTreeWalker(region, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        if (
          !parent ||
          !node.textContent?.trim() ||
          parent.closest('[aria-hidden=true],script,style')
        )
          continue;
        if (!parent.getClientRects().length || getComputedStyle(parent).visibility === 'hidden')
          continue;
        const style = getComputedStyle(parent);
        text.push({
          text: node.textContent.trim(),
          size: parseFloat(style.fontSize),
          family: style.fontFamily,
          color: style.color,
          background: style.backgroundColor,
        });
      }
    }
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      modality: document.documentElement.dataset.inputModality,
      text,
    };
  });
  expect(record.scrollWidth).toBeLessThanOrEqual(record.width);
  for (const item of record.text) {
    expect(item.size, item.text).toBeGreaterThanOrEqual(14);
    expect(item.family.startsWith('Outfit'), item.text).toBe(true);
  }
  await info.attach(`${name}-styles`, {
    body: JSON.stringify(record, null, 2),
    contentType: 'application/json',
  });
  await info.attach(`${name}-screen`, {
    body: await page.screenshot({ fullPage: false }),
    contentType: 'image/png',
  });
}

test('find, recover and orient through the canonical responsive navigation', async ({
  page,
}, info) => {
  const sizes =
    info.project.name === 'chromium'
      ? [
          [320, 720],
          [360, 720],
          [375, 720],
          [390, 844],
          [568, 320],
          [820, 900],
          [1280, 900],
          [1920, 1000],
        ]
      : [
          [320, 720],
          [1280, 900],
        ];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto('/components/');
    await expect(page.locator('[data-docs-shell-ready]')).toBeVisible();
    await page.keyboard.press('Control+k');
    const input = page.locator('#component-search');
    await expect(input).toBeFocused();
    await input.fill('no-such-component');
    await expect(page.locator('#search-status')).toBeVisible();
    await page.locator('[data-docs-search-clear]').click();
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
    await input.fill('Button');
    await expect(page.locator('[data-component-link="Button button"]')).toBeVisible();
    // A non-empty type=search field owns the first Escape in Chromium and Firefox (native
    // clear), so the dialog's close request needs a second one; WebKit closes first.
    await page.keyboard.press('Escape');
    const drawer = page.locator('[data-docs-drawer]');
    if (width < 875) {
      if (await drawer.evaluate(node => (node as HTMLDialogElement).open)) {
        await expect(input).toHaveValue('');
        await page.keyboard.press('Escape');
      }
      await expect(drawer).not.toBeVisible();
      await expect(page.locator('[data-docs-menu-toggle]')).toBeFocused();
      // The Drawer owns the Getting started route here; the sticky header stays two rows
      // at phone widths and one row in phone landscape, clear of the fixed Tweaker tab.
      await expect(page.locator('.header-link')).toBeHidden();
      const header = (await page.locator('.docs-header').boundingBox())!;
      expect(header.height, `header height at ${width}x${height}`).toBeLessThanOrEqual(
        height < 400 ? 80 : 130,
      );
    } else {
      await expect(page.locator('.header-link')).toBeVisible();
    }
    await evidence(page, info, `navigation-${width}`);
  }
});

test('guide and catalog Contents, contextual sources and truthful clipboard status', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    let attempts = 0;
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          if (++attempts > 1) throw new Error('denied');
        },
      },
    });
  });
  for (const route of ['/getting-started/', '/components/']) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route);
    const rail = page.locator('.shell-contents');
    await expect(rail.locator('[data-shell-contents-list] a').first()).toBeVisible();
    const anchors = await rail
      .locator('[data-shell-contents-list] a')
      .evaluateAll(links => links.map(link => (link as HTMLAnchorElement).hash.slice(1)));
    for (const id of anchors) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    const expectedSource =
      route === '/components/'
        ? 'docs/src/pages/components/index.astro'
        : 'docs/src/pages/getting-started.astro';
    await expect(rail.locator('a').filter({ hasText: 'Edit this page' })).toHaveAttribute(
      'href',
      `https://github.com/atonota/genux/edit/main/${expectedSource}`,
    );
    // Rail titles keep the shell emphasis above their links; repeated landmarks are named.
    await expect(rail.locator('.shell-contents-title')).toHaveCSS('font-weight', '600');
    const landmarkNames = await page.evaluate(() =>
      [...document.querySelectorAll('aside, nav')]
        .filter(node => node.getClientRects().length > 0)
        .map(
          node =>
            node.getAttribute('aria-label') ??
            document
              .getElementById(node.getAttribute('aria-labelledby') ?? '')
              ?.textContent?.trim() ??
            '',
        ),
    );
    expect(landmarkNames.every(Boolean), landmarkNames.join(' | ')).toBe(true);
    expect(new Set(landmarkNames).size, landmarkNames.join(' | ')).toBe(landmarkNames.length);
    const copy = rail.locator('[data-doc-copy-markdown]');
    await copy.click();
    await expect(rail.locator('[data-doc-copy-status]')).toHaveText('Markdown copied.');
    await copy.click();
    await expect(rail.locator('[data-doc-copy-status]')).toHaveText('Copy failed.');
    await evidence(page, info, `guide-${route.replaceAll('/', '')}`);
    await page.setViewportSize({ width: 320, height: 720 });
    await expect(page.locator('[data-doc-tools=article]')).toBeVisible();
    await page.locator('[data-doc-contents] summary').click();
    const link = page.locator('[data-doc-nav=sections] a').first();
    const hash = await link.getAttribute('href');
    await link.click();
    const heading = page.locator(hash!);
    expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(
      (await page.locator('.docs-header').boundingBox())!.height,
    );
  }
});

test('component tabs, continuation and protected inline preview survive shell changes', async ({
  page,
}, info) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/components/button/');
  await expect(page.locator('[data-doc-tabs]')).toBeVisible();
  await page.locator('[data-doc-tab=overview]').click();
  await expect(page.locator('[data-doc-tab=overview]')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Tab');
  expect(await page.locator('html').getAttribute('data-input-modality')).toBe('keyboard');
  await page.locator('[data-doc-tab=examples]').click();
  await expect(page.locator('iframe')).toHaveCount(0);
  const screen = page.locator('.example-preview-screen').first();
  await expect(screen).toBeVisible();
  await expect(screen).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.page-neighbors a[rel=next]')).toHaveAttribute(
    'href',
    /^\/components\/.+\/$/,
  );
  // Continuation follows the sidebar's visible (category-grouped) order, not the catalog array.
  const sidebarHrefs = await page
    .locator('.sidebar [data-component-link] a')
    .evaluateAll(links => links.map(link => link.getAttribute('href')));
  await expect(page.locator('.page-neighbors a[rel=next]')).toHaveAttribute(
    'href',
    sidebarHrefs[sidebarHrefs.indexOf('/components/button/') + 1]!,
  );
  await expect(page.locator('.shell-footer a[href="/licenses/"]')).toHaveCount(1);
  await expect(
    page.locator('.shell-footer a[href="https://github.com/atonota/genux"]'),
  ).toHaveCount(1);
  await evidence(page, info, 'component-desktop');
  await info.attach('initial-requests', {
    body: JSON.stringify(requests, null, 2),
    contentType: 'application/json',
  });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.setViewportSize({ width: 320, height: 720 });
  // The fixed Tweaker tab never covers reading text, links or controls at phone widths,
  // while the protected live preview keeps the article's full content width beside it.
  const tab = (await page
    .locator('[data-tweaker-page-trigger] [data-tweaker-trigger]')
    .boundingBox())!;
  const clearance = await page.evaluate(() => {
    const article = document.querySelector('.component-detail')!;
    const visible = (node: Element) =>
      node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden';
    const box = (node: Element) => {
      const rect = node.getBoundingClientRect();
      return { x: Math.round(rect.x), width: Math.round(rect.width) };
    };
    // Reading blocks count by their painted line boxes, controls by their whole target box;
    // a box inside a horizontal scroller (the tab row) is painted only up to the scroller's edge.
    const lineBoxesRight = (node: Element) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      return Math.max(0, ...[...range.getClientRects()].map(rect => rect.right));
    };
    const paintedRight = (node: Element) => {
      let right = node.matches('a, button, summary')
        ? node.getBoundingClientRect().right
        : lineBoxesRight(node);
      for (
        let parent = node.parentElement;
        parent && parent !== article;
        parent = parent.parentElement
      )
        if (getComputedStyle(parent).overflowX !== 'visible')
          right = Math.min(right, parent.getBoundingClientRect().right);
      return right;
    };
    let readingRight = 0;
    for (const node of article.querySelectorAll('p, h1, h2, h3, li, a, button, summary, code')) {
      if (!visible(node) || node.closest('.live-preview, .table-scroll, pre, [aria-hidden=true]'))
        continue;
      readingRight = Math.max(readingRight, paintedRight(node));
    }
    const leadRight = lineBoxesRight(article.querySelector('.lead')!);
    return {
      readingRight,
      leadRight,
      article: box(article),
      livePreview: box(article.querySelector('.live-preview')!),
    };
  });
  expect(clearance.readingRight, 'article reading boxes end before the tab').toBeLessThanOrEqual(
    tab.x,
  );
  expect(clearance.leadRight, 'lead line boxes end before the tab').toBeLessThanOrEqual(tab.x);
  expect(clearance.livePreview, 'live preview keeps the article width').toEqual(clearance.article);
  await evidence(page, info, 'component-narrow-dark');
});
