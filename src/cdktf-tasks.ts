import { Component } from "projen/lib/component";
import { Project } from "projen/lib/project";
import { Task } from "projen/lib/task";

/**
 * Adds standard CDKTF tasks to your project.
 */
export class CdktfTasks extends Component {
  /**
   * Runs `cdktf get`.
   */
  public readonly get: Task;

  /**
   * Synthesizes your app.
   */
  public readonly synth: Task;

  /**
   * Deploys your app.
   */
  public readonly deploy: Task;

  /**
   * Destroys all the stacks.
   */
  public readonly destroy: Task;

  /**
   * Diff against production.
   */
  public readonly diff: Task;

  /**
   * Watch task.
   */
  public readonly watch: Task;

  constructor(project: Project) {
    super(project);

    const cliEnv = {
      CHECKPOINT_DISABLE: "true",
    };

    this.get = project.addTask("get", {
      description: "Synthesizes your cdktf app into cdktf.out",
      exec: "cdktf get",
      env: cliEnv,
    });

    this.synth = project.addTask("synth", {
      description: "Synthesizes your cdktf app into cdktf.out",
      exec: "cdktf synth",
      env: cliEnv,
    });

    this.deploy = project.addTask("deploy", {
      description: "Deploys your cdktf app",
      exec: "cdktf deploy",
      env: cliEnv,
      receiveArgs: true,
    });

    this.destroy = project.addTask("destroy", {
      description: "Destroys your cdktf app",
      exec: "cdktf destroy",
      env: cliEnv,
      receiveArgs: true,
    });

    this.diff = project.addTask("diff", {
      description: "Diffs the currently deployed app against your code",
      exec: "cdktf diff",
      env: cliEnv,
    });

    // typescript projects already have a "watch" task, we will repurpose it
    const watch = project.tasks.tryFind("watch") ?? project.addTask("watch");

    watch.reset();
    watch.description =
      "Watches changes in your source code and rebuilds and deploys to the current account";

    // deploy first because surprisingly watch is not deploying first
    // see https://github.com/aws/aws-cdk/issues/17776
    // watch.exec("cdktf deploy --hotswap");

    // now we are ready to watch
    watch.exec("cdktf watch");

    watch.env("CHECKPOINT_DISABLE", "true");

    this.watch = watch;
  }
}
