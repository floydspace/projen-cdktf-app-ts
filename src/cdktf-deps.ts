import { Component } from "projen/lib/component";
import { DependencyType } from "projen/lib/dependencies";
import { Project } from "projen/lib/project";

/**
 * Options for `CdktfDeps`
 */
export interface CdktfDepsCommonOptions {
  /**
   * Minimum version of the CDKTF to depend on.
   *
   * @default - the default is "latest".
   */
  readonly cdktfVersion?: string;

  /**
   * Minimum version of the `constructs` library to depend on.
   *
   * @default - the default is "latest".
   */
  readonly constructsVersion?: string;
}

/**
 * Language-specific CDKTF package names.
 */
export interface CdktfPackageNames {
  /**
   * Fully qualified name of the core framework package for CDKTF
   */
  readonly core: string;
  /**
   * Fully qualified name of the constructs library package
   */
  readonly constructs: string;
}

/**
 * Manages dependencies on the CDKTF.
 */
export class CdktfDeps extends Component {
  constructor(project: Project, options: CdktfDepsCommonOptions) {
    super(project);

    const packageNames = this.packageNames();

    this.project.deps.addDependency(
      options.cdktfVersion
        ? `${packageNames.core}@^${options.cdktfVersion}`
        : packageNames.core,
      DependencyType.RUNTIME
    );

    this.project.deps.addDependency(
      options.constructsVersion
        ? `${packageNames.constructs}@^${options.constructsVersion}`
        : packageNames.constructs,
      DependencyType.RUNTIME
    );
  }

  private packageNames(): CdktfPackageNames {
    return {
      core: "cdktf",
      constructs: "constructs",
    };
  }
}
