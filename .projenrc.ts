import { cdk } from "projen";

const project = new cdk.JsiiProject({
  author: "Victor Korzunin",
  authorAddress: "ifloydrose@gmail.com",
  defaultReleaseBranch: "main",
  name: "projen-cdktf-app-ts",
  repositoryUrl: "https://github.com/floydspace/projen-cdktf-app-ts.git",
  packageName: "projen-cdktf-app-ts",
  description: "CDK for Terraform (CDKTF) app Projen project in TypeScript",
  prettier: true,
  eslint: true,
  jestOptions: {
    configFilePath: "jest.config.json",
  },
  projenrcTs: true,
  clobber: false,
  depsUpgrade: false,
  bundledDeps: ["fs-extra"],
  devDeps: ["@types/fs-extra"],
  peerDeps: ["projen@>=0.67.10 <1.0.0"],
});

project.synth();
