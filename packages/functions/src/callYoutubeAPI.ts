import { Handler } from "aws-lambda";
import axios from "axios";

export const handler: Handler = async () => {
  const { data } = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${process.env.API_KEY}`
  );
  const videos = data.items;

  const tags = videos.map(
    (video: { snippet: { tags: string[]; title: string } }) => ({
      tags: video.snippet.tags,
      title: video.snippet.title,
    })
  );

  const statistics = videos.map(
    (video: {
      snippet: { tags: string[]; title: string };
      statistics: any;
    }) => ({
      ...video.statistics,
      title: video.snippet.title,
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({ tags, statistics }),
  };
};
