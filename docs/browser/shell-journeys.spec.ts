import { expect, test, type Page, type TestInfo } from '@playwright/test';

async function capture(page: Page, info: TestInfo, name: string) {
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d')!;
    const rgba = (color: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    const over = (foreground: number[], background: number[]) =>
      foreground
        .slice(0, 3)
        .map(
          (channel, index) =>
            channel * (foreground[3] / 255) + background[index] * (1 - foreground[3] / 255),
        );
    const luminance = (color: number[]) =>
      color.slice(0, 3).reduce((sum, channel, index) => {
        const value = channel / 255;
        return (
          sum +
          (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4) *
            [0.2126, 0.7152, 0.0722][index]
        );
      }, 0);
    const samples = [
      ...document.querySelectorAll<HTMLElement>(
        '.docs-header, .sidebar, .shell-contents, .docs-page-tools, .shell-footer, .page-neighbors',
      ),
    ]
      .flatMap(region => [
        ...region.querySelectorAll<HTMLElement>('a, button, summary, p, h2, input'),
      ])
      .filter(
        node => node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden',
      )
      .map(node => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const layers: number[][] = [];
        for (let parent: HTMLElement | null = node; parent; parent = parent.parentElement)
          layers.unshift(rgba(getComputedStyle(parent).backgroundColor));
        const background = layers.reduce((color, layer) => over(layer, color), [255, 255, 255]);
        const foreground = over(rgba(style.color), background);
        const light = luminance(foreground);
        const dark = luminance(background);
        return {
          text: node.textContent?.trim(),
          size: parseFloat(style.fontSize),
          font: style.fontFamily,
          color: style.color,
          background: style.backgroundColor,
          width: rect.width,
          height: rect.height,
          contrast: (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05),
        };
      });
    return {
      width: innerWidth,
      height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      locale: document.documentElement.lang,
      theme: document.documentElement.dataset.theme,
      modality: document.documentElement.dataset.inputModality,
      samples,
    };
  });
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width);
  for (const sample of metrics.samples) {
    expect(sample.size, sample.text).toBeGreaterThanOrEqual(14);
    expect(sample.font.startsWith('Outfit'), sample.text).toBe(true);
    if (sample.text) expect(sample.contrast, sample.text).toBeGreaterThanOrEqual(4.5);
  }
  await info.attach(`${name}-metrics`, {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });
  await info.attach(`${name}-image`, { body: await page.screenshot(), contentType: 'image/png' });
}

test('search results, normal navigation and Drawer invokers keep continuity', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/components/');
  const search = page.locator('[data-docs-search]');
  await search.click();
  const input = page.locator('#component-search');
  await expect(input).toBeFocused();
  await input.fill('Button');
  await expect(
    page.locator('.nav-group').filter({ has: page.locator('a[href="/getting-started/"]') }),
  ).toBeHidden();
  const result = page.locator('[data-component-link="Button button"] a');
  await expect(result).toBeInViewport();
  await capture(page, info, 'search-matches-320');
  await result.click();
  await expect(page).toHaveURL(/\/components\/button\/$/);
  // The new document's shell script must own the Search trigger before it is used.
  await expect(page.locator('[data-docs-shell-ready]')).toBeVisible();
  await search.click();
  await expect(input).toHaveValue('Button');
  await page.locator('[data-docs-menu-close]').click();
  await expect(search).toBeFocused();
  await search.click();
  await page.locator('[data-docs-search-clear]').click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('');
  await expect(
    page.locator('.nav-group').filter({ has: page.locator('a[href="/getting-started/"]') }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(search).toBeFocused();
  // A shortcut invoked from a page control returns to that control, rather than Menu.
  const tab = page.locator('[data-doc-tab=examples]');
  await tab.focus();
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Escape');
  await expect(tab).toBeFocused();
  await page.setViewportSize({ width: 568, height: 320 });
  await search.click();
  const last = page.locator('.sidebar [data-component-link] a').last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
  await capture(page, info, 'short-height-navigation');
  await page.locator('[data-docs-menu-close]').click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await input.focus();
  await input.fill('Button');
  await page.setViewportSize({ width: 820, height: 900 });
  await expect(input).toBeFocused();
  await expect(page.locator('[data-docs-drawer]')).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('Button');
});

test('Contents uses native history and moves deliberate keyboard navigation to the labelled target', async ({
  page,
}, info) => {
  await page.goto('/getting-started/');
  await page.locator('[data-doc-contents] summary').click();
  // A Tab keydown turns the central keyboard modality on in every engine; WebKit keeps links
  // out of its Tab sequence, so the link is focused directly and checked before Enter.
  await page.keyboard.press('Tab');
  await expect(page.locator('html')).toHaveAttribute('data-input-modality', 'keyboard');
  const link = page.locator('[data-doc-nav=sections] a[href="#using-components"]');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#using-components$/);
  const heading = page.locator('#using-components h2');
  await expect(page.locator('#using-components')).toBeFocused();
  await expect(link).toHaveAttribute('aria-current', 'location');
  await expect(page.locator('[data-doc-contents]')).not.toHaveAttribute('open', '');
  // Ringless: outline-style none (CSS UI 4 keeps a computed width even then).
  const styles = await page.locator('#using-components').evaluate(node => ({
    outline: getComputedStyle(node).outlineStyle,
    decoration: getComputedStyle(node.querySelector('h2')!).textDecorationLine,
  }));
  expect(styles.outline).toBe('none');
  expect(styles.decoration).toContain('underline');
  const header = (await page.locator('.docs-header').boundingBox())!;
  expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(header.height);
  await capture(page, info, 'guide-target-focus-320');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.shell-contents a[href="#astro-integration"]').click();
  await expect(page.locator('#astro-integration')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/#using-components$/);
  await expect(page.locator('.shell-contents a[href="#using-components"]')).toHaveAttribute(
    'aria-current',
    'location',
  );
  await page.goto('/components/button/');
  await page.locator('[data-doc-tab=api]').click();
  await page.locator('.shell-contents a[href="#api"]').click();
  await expect(page.locator('[data-doc-tab=api]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#api')).toBeFocused();
  await expect(page.locator('.shell-contents a[href="#api"]')).toHaveAttribute(
    'aria-current',
    'location',
  );
  await page.locator('[data-doc-tab=examples]').click();
  await expect(page.locator('[data-doc-nav] [aria-current="location"]')).toHaveCount(0);
});

test('page actions stay quiet, usable and truthful across shared consumers', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    let count = 0;
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          if (++count % 2 === 0) throw new Error('denied');
        },
      },
    });
  });
  for (const route of ['/', '/components/', '/getting-started/', '/components/button/']) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(route);
    const tools = page.locator('[data-doc-tools=article]');
    await expect(tools.locator('summary')).toHaveText('Page actions');
    await expect(tools.locator('a').first()).toBeHidden();
    const motion = await tools.evaluate(node => {
      const style = getComputedStyle(node, '::details-content');
      return {
        supported: CSS.supports('selector(::details-content)'),
        duration: style.transitionDuration,
        easing: style.transitionTimingFunction,
      };
    });
    if (motion.supported) {
      expect(motion.duration.split(',').every(value => parseFloat(value) > 0)).toBe(true);
      expect(motion.easing).toContain('cubic-bezier(0.65, 0, 0.35, 1)');
    }
    await capture(page, info, `arrival-${route.replaceAll('/', '') || 'overview'}`);
    // Below the rail the Contents and Page actions disclosures are one group: same 48px row,
    // same weight and the same start edge for their summaries and, when open, their links.
    const group = await page.evaluate(() => {
      const measure = (summary: HTMLElement) => {
        const style = getComputedStyle(summary);
        return {
          x: summary.getBoundingClientRect().x + parseFloat(style.paddingLeft),
          height: summary.getBoundingClientRect().height,
          weight: style.fontWeight,
        };
      };
      const contents = document.querySelector<HTMLElement>('[data-doc-contents] > summary')!;
      const actions = document.querySelector<HTMLElement>('[data-doc-tools=article] > summary')!;
      return {
        contents: measure(contents),
        actions: measure(actions),
        gap: actions.getBoundingClientRect().top - contents.getBoundingClientRect().bottom,
      };
    });
    expect(group.actions.x).toBeCloseTo(group.contents.x, 0);
    expect(group.actions.weight).toBe(group.contents.weight);
    expect(group.contents.height).toBeGreaterThanOrEqual(48);
    expect(group.actions.height).toBeGreaterThanOrEqual(48);
    expect(group.gap).toBeLessThanOrEqual(1);
    await tools.locator('summary').click();
    await expect(tools.locator('a').first()).toBeVisible();
    await page.locator('[data-doc-contents] summary').click();
    const links = await page.evaluate(() => {
      // Component pages hide the section links of inactive tabs; measure a rendered one.
      const shown = (selector: string) =>
        [...document.querySelectorAll<HTMLElement>(selector)].find(
          node => node.getClientRects().length > 0,
        )!;
      return {
        contents: shown('[data-doc-nav=sections] a span').getBoundingClientRect().x,
        actions: shown('[data-doc-tools=article] a span').getBoundingClientRect().x,
      };
    });
    expect(links.actions).toBeCloseTo(links.contents, 0);
    await page.locator('[data-doc-contents] summary').click();
    const copy = tools.locator('[data-doc-copy-markdown]');
    await copy.click();
    await expect(tools.locator('[data-doc-copy-status]')).toHaveText('Markdown copied.');
    await copy.click();
    await expect(tools.locator('[data-doc-copy-status]')).toHaveText('Copy failed.');
    await page.locator('[data-locale-button=tr]').click();
    await expect(tools.locator('summary')).toHaveText('Sayfa işlemleri');
    await page.locator('[data-theme-toggle]').click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    if (motion.supported)
      expect(
        await tools.evaluate(
          node => getComputedStyle(node, '::details-content').transitionDuration,
        ),
      ).toBe('0s');
    await tools.scrollIntoViewIfNeeded();
    await capture(page, info, `tools-tr-${route.replaceAll('/', '') || 'overview'}`);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(tools).toBeHidden();
    const rail = page.locator('[data-doc-tools=rail]');
    await expect(rail.locator('a').first()).toBeVisible();
    await page.locator('.shell-footer').scrollIntoViewIfNeeded();
    await expect(
      page.locator('.shell-footer a[href="https://github.com/atonota/genux/blob/main/LICENSE"]'),
    ).toBeVisible();
    await capture(page, info, `ending-${route.replaceAll('/', '') || 'overview'}`);
    await page.locator('[data-locale-button=en]').click();
  }
});
