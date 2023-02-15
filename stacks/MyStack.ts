import { StackContext, Api, Function } from "sst/constructs";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Chain, Parallel, StateMachine } from "aws-cdk-lib/aws-stepfunctions";

export function MyStack({ stack }: StackContext) {
  const callYoutubeTask = new LambdaInvoke(stack, "callYoutubeTask", {
    lambdaFunction: new Function(stack, "callYoutubeTask-func", {
      handler: "packages/functions/src/callYoutubeAPI.handler",
      environment: {
        API_KEY: process.env.API_KEY ?? "",
      },
    }),
  });

  const countTagsTask = new LambdaInvoke(stack, "countTagsTask", {
    lambdaFunction: new Function(stack, "countTagsTask-func", {
      handler: "packages/functions/src/countTags.handler",
    }),
  });

  const countStatisticsTask = new LambdaInvoke(stack, "countStatisticsTask", {
    lambdaFunction: new Function(stack, "countStatisticsTask-func", {
      handler: "packages/functions/src/countStatistics.handler",
    }),
  });

  const aggregateData = new LambdaInvoke(stack, "aggregateData", {
    lambdaFunction: new Function(stack, "aggregateData-func", {
      handler: "packages/functions/src/aggregateData.handler",
    }),
  });

  const parallel = new Parallel(stack, "ParallelCompute");

  const stateDefinition = Chain.start(callYoutubeTask)
    .next(parallel.branch(countTagsTask).branch(countStatisticsTask))
    .next(aggregateData);

  const stateMachine = new StateMachine(stack, "StateMachineExample", {
    definition: stateDefinition,
  });

  const api = new Api(stack, "apiStartMachine", {
    routes: {
      "GET /start-machine": {
        function: {
          handler: "packages/functions/src/startMachine.handler",
          environment: {
            STATE_MACHINE: stateMachine.stateMachineArn,
          },
        },
      },
    },
  });

  api.attachPermissionsToRoute("GET /start-machine", [
    [stateMachine, "grantStartExecution"],
  ]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
