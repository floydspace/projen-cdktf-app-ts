# 📦 projen-cdktf-app-ts

CDK for Terraform (CDKTF) app Projen project in TypeScript

[![npm version](https://img.shields.io/npm/v/projen-cdktf-app-ts?color=brightgreen&label=npm%20package)](https://www.npmjs.com/package/projen-cdktf-app-ts)
[![npm downloads](https://img.shields.io/npm/dm/projen-cdktf-app-ts)](https://www.npmjs.com/package/projen-cdktf-app-ts)
[![build status](https://img.shields.io/github/actions/workflow/status/floydspace/projen-cdktf-app-ts/build.yml?label=build)](https://github.com/floydspace/projen-cdktf-app-ts/actions/workflows/build.yml)
[![release status](https://img.shields.io/github/actions/workflow/status/floydspace/projen-cdktf-app-ts/release.yml?label=release)](https://github.com/floydspace/projen-cdktf-app-ts/actions/workflows/release.yml)

Welcome to the home of
[`projen-cdktf-app-ts`](https://www.npmjs.com/package/projen-cdktf-app-ts)!

This is an external [`projen`](https://github.com/projen/projen)
project type that aims to make creating CDK for Terraform (CDKTF) app projects in
TypeScript easier.

## Usage

```bash
npx projen new --from projen-cdktf-app-ts --projenrc-ts
```

## Example

```ts
import { CdktfTypeScriptApp } from "projen-cdktf-app-ts";

const project = new CdktfTypeScriptApp({
  name: "my-cdktf-app",
  defaultReleaseBranch: "main",
  devDeps: ["projen-cdktf-app-ts"],
  projenrcTs: true,

  terraformProviders: ["hashicorp/aws@~> 4.0"],
});

project.synth();
```

See the project type [API Reference](API.md).

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
