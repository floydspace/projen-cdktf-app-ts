## CDK for Terraform (CDKTF) app project in TypeScript

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
