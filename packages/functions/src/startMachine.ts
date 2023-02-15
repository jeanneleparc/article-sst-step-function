import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const client = new SFNClient({});

  await client.send(
    new StartExecutionCommand({
      stateMachineArn: process.env.STATE_MACHINE,
    })
  );
  return {
    statusCode: 200,
    body: "Start machine started",
  };
};
