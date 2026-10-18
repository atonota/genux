import { test, expect, type Page, type TestInfo } from '@playwright/test';

const before = process.env.GENUX_TASK03_PHASE === 'before';
const base = process.env.GENUX_TASK03_BASE ?? '';
const card = `${base}/components/card/`;
const button = `${base}/components/button/`;
const ready = (page: Page) => expect(page.locator('[data-doc-page-ready]')).toHaveCount(1);
const overflow = async (page: Page) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
};
async function shot(page: Page, info: TestInfo, name: string) {
  // Evidence shows settled UI: let finite transitions (Drawer, disclosure, popup) finish first.
  await page.evaluate(() =>
    Promise.race([
      Promise.all(
        document
          .getAnimations()
          .filter(animation => animation.effect?.getTiming().iterations !== Infinity)
          .map(animation => animation.finished.catch(() => undefined)),
      ),
      new Promise(resolve => setTimeout(resolve, 1500)),
    ]),
  );
  await page.screenshot({ path: info.outputPath(`${before ? 'before' : 'after'}-${name}.png`) });
}
async function menu(page: Page) {
  if (await page.locator('[data-docs-menu-toggle]').isVisible()) {
    await page.locator('[data-docs-menu-toggle]').click();
    await expect(page.locator('[data-docs-drawer]')).toBeVisible();
  }
}
/** The required keyboard cue must be visible on the first focused frame (AGENT.md focus exception):
 * one non-surrounding marker painted as a background-image layer, which the central eased paint
 * list never transitions. The sample is taken once, synchronously, and compared with the rest state,
 * so an ordinary field fill or a fill that is still fading in cannot satisfy it. No paint polling. */
async function focusEvidence(
  page: Page,
  selector: string,
  textSelector: string,
  edge: 'start' | 'bottom',
) {
  const control = page.locator(selector);
  const sample = () =>
    control.evaluate((node, text) => {
      const read = (element: Element) => {
        const css = getComputedStyle(element);
        return {
          backgroundImage: css.backgroundImage,
          backgroundSize: css.backgroundSize,
          color: css.color,
          outline: css.outlineStyle,
          running: element
            .getAnimations()
            .filter((animation): animation is CSSTransition => animation instanceof CSSTransition)
            .map(animation => animation.transitionProperty),
        };
      };
      const label = node.querySelector(text);
      const root = getComputedStyle(node);
      return {
        focus: node.matches(':focus-visible'),
        modality: document.documentElement.dataset.inputModality,
        indicator: root.getPropertyValue('--focus-indicator-width').trim(),
        fieldIndicator: root.getPropertyValue('--field-focus-indicator-width').trim(),
        control: read(node),
        text: label ? read(label) : null,
      };
    }, textSelector);
  const rest = await sample();
  expect(rest.control.backgroundImage).toBe('none');
  expect(rest.text).not.toBeNull();
  await control.focus();
  // Tab is the sole keyboard-mode opener; focus is then deliberately returned to this control.
  await page.keyboard.press('Tab');
  await control.focus();
  const focused = await sample();
  expect(focused.modality).toBe('keyboard');
  expect(focused.focus).toBe(true);
  expect(focused.control.outline).toBe('none');
  // The marker layer is present at once, in the indicator color, on exactly one edge.
  expect(focused.control.backgroundImage).toMatch(/^linear-gradient\(/);
  expect(focused.control.backgroundImage).not.toMatch(/rgba\(\d+, \d+, \d+, 0\)|transparent/);
  expect(focused.control.backgroundSize).toBe(
    edge === 'start' ? `${focused.indicator} 100%` : `100% ${focused.fieldIndicator}`,
  );
  // Readable text: the label keeps its rest color on the first frame and nothing is easing it.
  expect(focused.control.color).toBe(rest.control.color);
  expect(focused.text?.color).toBe(rest.text?.color);
  for (const part of [focused.control, focused.text])
    for (const property of ['color', 'background-image'])
      expect(part?.running ?? []).not.toContain(property);
}

test('sidebar disclosures cooperate with search, state and the same mobile Drawer', async ({
  page,
}, info) => {
  await page.goto(card);
  await ready(page);
  await overflow(page);
  await menu(page);
  await shot(page, info, 'sidebar-320');
  if (before) {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await shot(page, info, 'sidebar-desktop');
    return;
  }
  const active = page
    .locator('details.nav-group')
    .filter({ has: page.locator('a[aria-current="page"]') });
  await expect(active).toHaveAttribute('open', '');
  const actions = page.locator('details[data-nav-group="Actions"]');
  await expect(actions).not.toHaveAttribute('open', '');
  const start = page.locator('details[data-nav-group="Start"]');
  await focusEvidence(page, 'details[data-nav-group="Start"] > summary', 'h2', 'start');
  await page.keyboard.press('Enter');
  await expect(start).toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(start).not.toHaveAttribute('open', '');
  const search = page.locator('#component-search');
  await search.fill('button');
  await expect(actions).toHaveAttribute('open', '');
  await expect(actions.getByRole('link', { name: 'Button', exact: true })).toBeVisible();
  await page.locator('[data-docs-search-clear]').click();
  await expect(actions).not.toHaveAttribute('open', '');
  await expect(search).toBeFocused();
  await search.fill('button');
  await actions.getByRole('link', { name: 'Button', exact: true }).click();
  await expect(page).toHaveURL(new RegExp('/components/button/'));
  await ready(page);
  await menu(page);
  await expect(page.locator('#component-search')).toHaveValue('button');
  await page.locator('[data-docs-search-clear]').click();
  await expect(page.locator('details[data-nav-group="Actions"]')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-docs-menu-toggle]')).toBeFocused();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await overflow(page);
  await shot(page, info, 'sidebar-desktop');
  const summary = page.locator('details[data-nav-group="Actions"] > summary');
  await summary.click();
  await expect(page.locator('details[data-nav-group="Actions"]')).not.toHaveAttribute('open', '');
  // Reverse the same disclosure during its central transition; semantics never wait for paint.
  await summary.press('Enter');
  await expect(page.locator('details[data-nav-group="Actions"]')).toHaveAttribute('open', '');
  await summary.press('Enter');
  await expect(page.locator('details[data-nav-group="Actions"]')).not.toHaveAttribute('open', '');
  const transition = await page
    .locator('.nav-group-chevron')
    .first()
    .evaluate(node => {
      const css = getComputedStyle(node);
      return [css.transitionDuration, css.transitionTimingFunction];
    });
  expect(transition[0]).not.toBe('0s');
  expect(transition[1]).toBe('cubic-bezier(0.65, 0, 0.35, 1)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('.nav-group-chevron')
      .first()
      .evaluate(node => getComputedStyle(node).transitionDuration),
  ).toBe('0s');
});

test('one package picker preserves command preference, Escape focus, outer history and no-JS content', async ({
  page,
  browser,
}, info) => {
  await page.goto(card + '?tab=integration');
  await ready(page);
  await page.locator('[data-install]').scrollIntoViewIfNeeded();
  await overflow(page);
  await shot(page, info, 'picker-320');
  if (before) {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.locator('[data-install]').scrollIntoViewIfNeeded();
    await shot(page, info, 'picker-desktop');
    return;
  }
  const trigger = page.getByRole('combobox', { name: 'Package manager' });
  await expect(trigger).toHaveCount(1);
  await expect(page.locator('[data-install] [role="tab"]')).toHaveCount(0);
  await focusEvidence(page, '[data-install-trigger]', '[data-install-value]', 'bottom');
  await trigger.press('Enter');
  const listbox = page.getByRole('listbox', { name: 'Package manager' });
  // The engine moves focus into the list on its own frame (semantic wait); the focused option's
  // marker is then sampled once, immediately: nothing above it may be fading it in.
  await expect(listbox).toBeFocused();
  const entry = await listbox.evaluate(node => {
    const chain: Element[] = [];
    for (let element: Element | null = node; element && element !== document.body; )
      (chain.push(element), (element = element.parentElement));
    const option = node.querySelector('[data-highlighted]');
    return {
      focus: node.matches(':focus-visible'),
      opacity: chain.map(element => getComputedStyle(element).opacity),
      fading: chain.some(element =>
        element
          .getAnimations()
          .some(
            animation =>
              animation instanceof CSSTransition && animation.transitionProperty === 'opacity',
          ),
      ),
      marker: option ? getComputedStyle(option).boxShadow : 'none',
    };
  });
  expect(entry.focus).toBe(true);
  expect(entry.opacity.every(value => value === '1')).toBe(true);
  expect(entry.fading).toBe(false);
  expect(entry.marker).not.toBe('none');
  await expect(listbox).toBeVisible();
  // The popup still opens and closes with positive symmetric Cubic motion on every transition part.
  const popup = await listbox.evaluate(node => {
    const css = getComputedStyle(node);
    return [css.transitionDuration, css.transitionTimingFunction];
  });
  for (const duration of popup[0].split(',')) expect(duration.trim()).not.toBe('0s');
  for (const easing of popup[1].split(/,(?![^(]*\))/))
    expect(easing.trim()).toBe('cubic-bezier(0.65, 0, 0.35, 1)');
  await shot(page, info, 'picker-open-320');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(trigger).toContainText('bun');
  await expect(page.locator('[data-install-command]:visible')).toHaveCount(1);
  await expect(page.locator('[data-install-command="bun"]')).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.reload();
  await ready(page);
  await expect(trigger).toContainText('bun');
  await page.getByRole('tab', { name: 'API', exact: true }).click();
  await expect(page).toHaveURL(/tab=api/);
  await page.goBack();
  await expect(page.getByRole('tab', { name: 'Integration', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.locator('[data-install]').scrollIntoViewIfNeeded();
  await trigger.click();
  await shot(page, info, 'picker-desktop');
  await page.getByRole('option', { name: 'pnpm' }).click();
  await expect(trigger).toContainText('pnpm');
  await overflow(page);
  // The closed list is hidden, so it is read by its attribute, not by role.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('[data-install-options]')
      .evaluate(node => getComputedStyle(node).transitionDuration),
  ).toBe('0s');
  await page.emulateMedia({ reducedMotion: null });
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 720 },
  });
  const plain = await context.newPage();
  await plain.goto('http://127.0.0.1:4337' + card);
  await expect(plain.locator('[data-install-command]')).toHaveCount(4);
  for (const command of await plain.locator('[data-install-command]').all())
    await expect(command).toBeVisible();
  await expect(plain.locator('[data-install-picker]')).toBeHidden();
  await overflow(plain);
  await context.close();
});

test('Card navigation rows align and page tools edit distinct real TSX owners', async ({
  page,
}, info) => {
  await page.goto(card);
  await ready(page);
  await overflow(page);
  await page.locator('.card-navigation').scrollIntoViewIfNeeded();
  await shot(page, info, 'alignment-320');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.locator('.card-navigation').scrollIntoViewIfNeeded();
  await shot(page, info, 'alignment-desktop');
  const metrics = await page.locator('.card-navigation a').evaluateAll(links =>
    links.map(link => {
      const rect = link.getBoundingClientRect();
      const css = getComputedStyle(link);
      return {
        text: link.textContent,
        center: rect.y + rect.height / 2,
        top: rect.top,
        bottom: rect.bottom,
        font: parseFloat(css.fontSize),
      };
    }),
  );
  await info.attach('alignment-measurements', {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });
  expect(metrics.length).toBeGreaterThan(1);
  expect(
    Math.max(...metrics.map(m => m.center)) - Math.min(...metrics.map(m => m.center)),
  ).toBeLessThanOrEqual(1);
  for (const item of metrics) expect(item.font).toBeGreaterThanOrEqual(14);
  await overflow(page);
  if (before) return;
  const shell = await page
    .locator('.docs-header > :is(.wordmark, .docs-search-trigger, .locale-controls, .theme-toggle)')
    .evaluateAll(nodes =>
      nodes.map(node => {
        const rect = node.getBoundingClientRect();
        return rect.y + rect.height / 2;
      }),
    );
  expect(Math.max(...shell) - Math.min(...shell)).toBeLessThanOrEqual(1);
  for (const [route, name] of [
    [card, 'Card'],
    [button, 'Button'],
  ]) {
    await page.goto(route);
    await ready(page);
    const edits = page.locator('[data-doc-tools] a[href*="/edit/"]');
    await expect(edits).toHaveCount(2);
    for (const edit of await edits.all())
      await expect(edit).toHaveAttribute(
        'href',
        `https://github.com/atonota/genux/edit/main/docs/src/templates/components/${name}.tsx`,
      );
    await expect(page.locator('h1')).toHaveText(name);
  }
});
