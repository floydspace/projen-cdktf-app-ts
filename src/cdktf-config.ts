import { Component } from "projen/lib/component";
import { JsonFile } from "projen/lib/json";
import { Project } from "projen/lib/project";

/**
 * Common options for `cdktf.json`.
 */
export interface CdktfConfigCommonOptions {
  /**
   * cdktf.out directory.
   *
   * @default "cdktf.out"
   */
  readonly cdktfOut?: string;
  /**
   * Terraform providers to install.
   */
  readonly terraformProviders?: RequirementDefinition[];
  /**
   * Terraform modules to install.
   */
  readonly terraformModules?: RequirementDefinition[];
  /**
   * Terraform context features.
   *
   * @default { excludeStackIdFromLogicalIds: "true", allowSepCharsInLogicalIds: "true" }
   * @see https://developer.hashicorp.com/terraform/cdktf/create-and-deploy/configuration-file#enable-features-deprecated
   */
  readonly context?: Record<string, any>;
}

export interface TerraformDependencyConstraint {
  readonly name: string; // name of the module / provider
  readonly source?: string; // path / url / registry identifier for the module / provider
  readonly version?: string; // version constraint (https://www.terraform.io/docs/language/providers/requirements.html#version-constraints)
}
export type RequirementDefinition = string | TerraformDependencyConstraint;

/**
 * Options for `CdktfJson`.
 */
export interface CdktfConfigOptions extends CdktfConfigCommonOptions {
  /**
   * The command line to execute in order to synthesize the CDKTF application
   * (language specific).
   */
  readonly app: string;
}

/**
 * Represents cdktf.json file.
 */
export class CdktfConfig extends Component {
  /**
   * Represents the JSON file.
   */
  public readonly json: JsonFile;

  /**
   * Name of the cdktf.out directory.
   */
  public readonly cdktfOut: string;

  constructor(project: Project, options: CdktfConfigOptions) {
    super(project);

    this.cdktfOut = options.cdktfOut ?? "cdktf.out";

    this.json = new JsonFile(project, "cdktf.json", {
      omitEmpty: true,
      obj: {
        app: options.app,
        language: "typescript",
        output: this.cdktfOut,
        terraformProviders: options.terraformProviders,
        terraformModules: options.terraformModules,
        context: {
          excludeStackIdFromLogicalIds: "true",
          allowSepCharsInLogicalIds: "true",
          ...options.context,
        },
      },
    });

    project.gitignore.exclude(`/${this.cdktfOut}/`);
    project.gitignore.exclude(".cdktf.staging/");
  }
}
