import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'Victor Korzunin',
  authorAddress: 'user@domain.com',
  defaultReleaseBranch: 'main',
  name: 'cdktf-app-ts',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/user/cdktf-app-ts.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();