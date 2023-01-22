import { synthSnapshot } from "projen/lib/util/synth";

import { CdktfTypeScriptApp } from "../src";

describe("cdktf", () => {
  test('use "cdktf" the constructs at *', () => {
    const project = new CdktfTypeScriptApp({
      cdktfVersion: "0.15.0",
      defaultReleaseBranch: "main",
      name: "test",
    });
    const snap = synthSnapshot(project);
    expect(snap["package.json"].dependencies).toStrictEqual({
      cdktf: "^0.15.0",
      constructs: "*",
    });
    expect(
      snap["src/main.ts"].indexOf("import { App, TerraformStack } from 'cdktf'")
    ).not.toEqual(-1);
    expect(
      snap["src/main.ts"].indexOf("import { Construct } from 'constructs'")
    ).not.toEqual(-1);
  });

  test("empty context", () => {
    const project = new CdktfTypeScriptApp({
      defaultReleaseBranch: "main",
      name: "test",
    });
    const snap = synthSnapshot(project);
    expect(snap["cdktf.json"].context).toStrictEqual({
      excludeStackIdFromLogicalIds: "true",
      allowSepCharsInLogicalIds: "true",
    });
  });
});

describe("synth", () => {
  let project: CdktfTypeScriptApp;
  let files: Record<string, any>;

  beforeEach(() => {
    project = new CdktfTypeScriptApp({
      name: "hello",
      defaultReleaseBranch: "main",
    });

    files = synthSnapshot(project);
  });

  it('adds a "synth" task', () => {
    expect(files[".projen/tasks.json"].tasks.synth).toStrictEqual({
      name: "synth",
      description: "Synthesizes your cdktf app into cdktf.out",
      steps: [{ exec: "cdktf synth" }],
      env: { CHECKPOINT_DISABLE: "true" },
    });
  });

  it('spawns a "synth" post-compile task', () => {
    expect(
      files[".projen/tasks.json"].tasks["post-compile"].steps
    ).toStrictEqual([{ spawn: "synth" }]);
  });
});

describe("watch", () => {
  let project: CdktfTypeScriptApp;
  let files: Record<string, any>;

  beforeEach(() => {
    project = new CdktfTypeScriptApp({
      name: "hello",
      defaultReleaseBranch: "main",
    });

    files = synthSnapshot(project);
  });

  it('adds a "watch" task', () => {
    expect(files[".projen/tasks.json"].tasks.watch).toStrictEqual({
      name: "watch",
      description:
        "Watches changes in your source code and rebuilds and deploys to the current account",
      steps: [{ exec: "cdktf watch" }],
      env: { CHECKPOINT_DISABLE: "true" },
    });
  });

  it('configures the "language" option in cdktf.json to "typescript"', () => {
    expect(files["cdktf.json"].language).toStrictEqual("typescript");
  });

  it('removes the "bundle" task from pre-compile', () => {
    expect(
      files[".projen/tasks.json"].tasks["pre-compile"].steps
    ).toBeUndefined();
  });
});
