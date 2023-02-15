import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const { statistics } = JSON.parse(event.Payload.body);

  const statisticsCount = statistics.map(
    (statistics: {
      viewCount: string;
      likeCount: string;
      favoriteCount: string;
      commentCount: string;
      title: string;
    }) => ({
      engagementRate:
        (parseInt(statistics.likeCount, 10) /
          parseInt(statistics.viewCount, 10)) *
        100,
      title: statistics.title,
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify(statisticsCount),
  };
};
