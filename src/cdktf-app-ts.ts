import * as path from "path";
import * as fs from "fs-extra";
import { Component } from "projen/lib/component";
import {
  TypeScriptAppProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";

import { CdktfConfig, CdktfConfigCommonOptions } from "./cdktf-config";
import { CdktfDeps, CdktfDepsCommonOptions } from "./cdktf-deps";
import { CdktfTasks } from "./cdktf-tasks";

export interface CdktfTypeScriptAppOptions
  extends TypeScriptProjectOptions,
    CdktfConfigCommonOptions,
    CdktfDepsCommonOptions {
  /**
   * The CDKTF app's entrypoint (relative to the source directory, which is
   * "src" by default).
   *
   * @default "main.ts"
   */
  readonly appEntrypoint?: string;
}

/**
 * CDKTF app in TypeScript
 *
 * @pjid cdktf-app-ts
 */
export class CdktfTypeScriptApp extends TypeScriptAppProject {
  /**
   * The CDKTF app entrypoint
   */
  public readonly appEntrypoint: string;

  /**
   * Common CDKTF tasks.
   */
  public readonly cdktfTasks: CdktfTasks;

  /**
   * cdktf.json configuration.
   */
  public readonly cdktfConfig: CdktfConfig;

  constructor(options: CdktfTypeScriptAppOptions) {
    super({
      ...options,
      sampleCode: false,
      bundlerOptions: {
        ...options.bundlerOptions,

        // we invoke the "bundle" task as part of the build step in cdktf.json so
        // we don't want it to be added to the pre-compile phase.
        addToPreCompile: false,
      },
      tsconfig: {
        ...options.tsconfig,
        compilerOptions: {
          ...options.tsconfig?.compilerOptions,
          rootDir: undefined, // force rootDir to be default, so .gen will be discovered
        },
      },
    });

    new CdktfDeps(this, options);
    this.appEntrypoint = options.appEntrypoint ?? "main.ts";

    // CLI
    this.addDevDeps(
      options.cdktfVersion ? `cdktf-cli@${options.cdktfVersion}` : "cdktf-cli"
    );

    // no compile step because we do all of it in typescript directly
    this.compileTask.reset();

    this.cdktfTasks = new CdktfTasks(this);

    // add synth to the build
    this.postCompileTask.spawn(this.cdktfTasks.synth);

    const tsConfigFile = this.tsconfig?.fileName;
    if (!tsConfigFile) {
      throw new Error("Expecting tsconfig.json");
    }

    this.cdktfConfig = new CdktfConfig(this, {
      app: `npx ts-node -P ${tsConfigFile} --prefer-ts-exts ${path.posix.join(
        this.srcdir,
        this.appEntrypoint
      )}`,
      ...options,
    });

    this.gitignore.exclude(".parcel-cache/");
    this.gitignore.exclude(".gen/");

    this.npmignore?.exclude(`${this.cdktfConfig.cdktfOut}/`);
    this.npmignore?.exclude(".cdktf.staging/");

    if (this.tsconfig) {
      this.tsconfig.exclude.push(this.cdktfConfig.cdktfOut);
    }

    this.addDevDeps("ts-node");
    if (options.sampleCode ?? true) {
      new SampleCode(this);
    }
  }
}

class SampleCode extends Component {
  private readonly appProject: CdktfTypeScriptApp;

  constructor(project: CdktfTypeScriptApp) {
    super(project);
    this.appProject = project;
  }

  public synthesize() {
    const outdir = this.project.outdir;
    const srcdir = path.join(outdir, this.appProject.srcdir);
    if (
      fs.pathExistsSync(srcdir) &&
      fs.readdirSync(srcdir).filter((x) => x.endsWith(".ts"))
    ) {
      return;
    }

    const srcImports = new Array<string>();
    srcImports.push("import { App, TerraformStack } from 'cdktf';");
    srcImports.push("import { Construct } from 'constructs';");

    const srcCode = `${srcImports.join("\n")}

export class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here...
  }
}

const app = new App();

new MyStack(app, '${this.project.name}-dev');
// new MyStack(app, '${this.project.name}-prod');

app.synth();`;

    fs.mkdirpSync(srcdir);
    fs.writeFileSync(path.join(srcdir, this.appProject.appEntrypoint), srcCode);

    const testdir = path.join(outdir, this.appProject.testdir);
    if (
      fs.pathExistsSync(testdir) &&
      fs.readdirSync(testdir).filter((x) => x.endsWith(".ts"))
    ) {
      return;
    }

    const testImports = new Array<string>();
    testImports.push("import { Testing } from 'cdktf';");

    const appEntrypointName = path.basename(
      this.appProject.appEntrypoint,
      ".ts"
    );
    const testCode = `${testImports.join("\n")}
import { MyStack } from '../${this.appProject.srcdir}/${appEntrypointName}';

test('Snapshot', () => {
  const template = Testing.synthScope((scope) => {
    new MyStack(scope, 'test');
  })
  expect(template).toMatchSnapshot();
});`;

    fs.mkdirpSync(testdir);
    fs.writeFileSync(
      path.join(testdir, `${appEntrypointName}.test.ts`),
      testCode
    );
  }
}
