import { cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const buildOutput = resolve('dist/lifestyle-stores/browser');
const instrumentedApp = resolve('dist/lifestyle-stores-instrumented');
const nycOutput = resolve('.nyc_output');
const nestedNycOutput = resolve('e2e/.nyc_output');
const legacyInstrumentedApp = resolve('coverage/instrumented-app');
const instrumentedAppTest = resolve('coverage/instrumented-app-test');

await rm(instrumentedApp, { force: true, recursive: true });
await rm(nycOutput, { force: true, recursive: true });
await rm(nestedNycOutput, { force: true, recursive: true });
await rm(legacyInstrumentedApp, { force: true, recursive: true });
await rm(instrumentedAppTest, { force: true, recursive: true });
await cp(buildOutput, instrumentedApp, { recursive: true });
