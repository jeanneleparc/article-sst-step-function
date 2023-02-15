import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const tags = JSON.parse(event[0].Payload.body);
  const statistics = JSON.parse(event[1].Payload.body);

  const compareFnStats = (a: any, b: any) => {
    if (a.engagementRate < b.engagementRate) return 1;
    if (a.engagementRate > b.engagementRate) return -1;
    return 0;
  };
  const statisticsSorted = statistics.sort(compareFnStats);

  const aggregateData = statisticsSorted.map(
    (stats: { engagementRate: number; title: string }) => {
      const tag = tags.find(
        (tag: { tagCount: number; title: string }) => tag.title === stats.title
      );
      return { ...stats, tagCount: tag.tagCount };
    }
  );
  return {
    statusCode: 200,
    body: JSON.stringify(aggregateData),
  };
};
