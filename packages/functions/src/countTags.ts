import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const { tags } = JSON.parse(event.Payload.body);

  const tagsCount = tags.map(
    (tagsAndTitle: { tags: string[]; title: string }) => ({
      tagCount: tagsAndTitle.tags?.length ?? 0,
      title: tagsAndTitle.title,
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify(tagsCount),
  };
};
