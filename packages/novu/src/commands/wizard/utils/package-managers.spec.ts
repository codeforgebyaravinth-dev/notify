import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { detectPackageManager, PACKAGE_MANAGER_BY_NAME, renderInstallCommand } from './package-managers';

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wizard-pm-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('detectPackageManager', () => {
  it('returns pnpm when pnpm-lock.yaml is present', () => {
    fs.writeFileSync(path.join(tempDir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n');
    expect(detectPackageManager(tempDir).name).toBe('pnpm');
  });

  it('distinguishes yarn v1 by lockfile header', () => {
    fs.writeFileSync(path.join(tempDir, 'yarn.lock'), '# yarn lockfile v1\n');
    expect(detectPackageManager(tempDir).name).toBe('yarn-v1');
  });

  it('distinguishes yarn v2+ by __metadata block', () => {
    fs.writeFileSync(path.join(tempDir, 'yarn.lock'), '__metadata:\n  version: 6\n');
    expect(detectPackageManager(tempDir).name).toBe('yarn-v2');
  });

  it('returns bun for bun.lockb / bun.lock files', () => {
    fs.writeFileSync(path.join(tempDir, 'bun.lockb'), '');
    expect(detectPackageManager(tempDir).name).toBe('bun');
  });

  it('falls back to npm when no lockfile is recognised', () => {
    expect(detectPackageManager(tempDir).name).toBe('npm');
  });
});

describe('renderInstallCommand', () => {
  it('throws when given an empty packages array', () => {
    expect(() =>
      renderInstallCommand({
        descriptor: PACKAGE_MANAGER_BY_NAME.pnpm,
        packages: [],
      })
    ).toThrow();
  });

  it('emits a single command containing every package for pnpm without a workspace filter', () => {
    expect(
      renderInstallCommand({
        descriptor: PACKAGE_MANAGER_BY_NAME.pnpm,
        packages: ['@notify/nextjs', '@notify/api'],
      })
    ).toBe('pnpm add @notify/nextjs @notify/api --ignore-workspace-root-check');
  });

  it('appends --legacy-peer-deps only for npm + opt-in', () => {
    expect(
      renderInstallCommand({
        descriptor: PACKAGE_MANAGER_BY_NAME.npm,
        packages: ['@notify/react'],
        legacyPeerDeps: true,
      })
    ).toBe('npm install @notify/react --legacy-peer-deps');

    expect(
      renderInstallCommand({
        descriptor: PACKAGE_MANAGER_BY_NAME.pnpm,
        packages: ['@notify/react'],
        legacyPeerDeps: true,
      })
    ).toBe('pnpm add @notify/react --ignore-workspace-root-check');
  });

  it('puts the yarn workspace filter before `add`', () => {
    expect(
      renderInstallCommand({
        descriptor: PACKAGE_MANAGER_BY_NAME['yarn-v2'],
        packages: ['@notify/react'],
        workspaceName: '@app/web',
      })
    ).toBe('yarn workspace @app/web add @notify/react');
  });

  it('appends --force when requested', () => {
    expect(
      renderInstallCommand({
        descriptor: PACKAGE_MANAGER_BY_NAME.npm,
        packages: ['@notify/react'],
        force: true,
      })
    ).toBe('npm install @notify/react --force');
  });
});
