import { expect, test as base } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type IstanbulCoverage = Record<string, unknown>;

declare global {
  interface Window {
    __coverage__?: IstanbulCoverage;
  }
}

function coverageFileName(testId: string): string {
  return `${testId.replace(/[^a-z0-9-]/gi, '-')}-${Date.now()}.json`;
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    if (!process.env['PLAYWRIGHT_COVERAGE']) {
      return;
    }

    const coverage = await page
      .evaluate(() => window.__coverage__)
      .catch(() => undefined);

    if (!coverage || Object.keys(coverage).length === 0) {
      return;
    }

    const outputDir = path.resolve(process.cwd(), '.nyc_output');
    await mkdir(outputDir, { recursive: true });
    await writeFile(
      path.join(outputDir, coverageFileName(testInfo.testId)),
      JSON.stringify(coverage),
    );
  },
});

export { expect };
