import React, { useState } from "react";
import axios from "axios";
// import ReactLoading from "react-loading";

interface Article {
  id: number;
  title: string;
  url: string;
  time: number;
  by: string
  score: number
}

const convertUnixTimeToDate = (unixTime: number): string => {
  const date = new Date(unixTime * 1000); // Convert seconds to milliseconds
  return date.toLocaleString(); // Converts to local date and time string
};

const App: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);
  //   const [loading, setLoading] = useState(false);

  const fetchRandomArticle = async () => {
    // setLoading(true);
    try {
      // Fetch the top stories
      const topStoriesResponse = await axios.get<number[]>(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
      );
      const newStoriesResponse = await axios.get<number[]>(
        "https://hacker-news.firebaseio.com/v0/newstories.json"
      );
      const bestStoriesResponse = await axios.get<number[]>(
        "https://hacker-news.firebaseio.com/v0/beststories.json"
      );

      // Combine all story IDs into one array
      const allStoryIds = [
        ...topStoriesResponse.data,
        ...newStoriesResponse.data,
        ...bestStoriesResponse.data,
      ];

      // Pick a random story ID from the combined list
      const randomIndex = Math.floor(Math.random() * allStoryIds.length);
      const randomStoryId = allStoryIds[randomIndex];

      // Fetch the details of the random story
      const storyResponse = await axios.get<Article>(
        `https://hacker-news.firebaseio.com/v0/item/${randomStoryId}.json`
      );
      setArticle(storyResponse.data);
    } catch (error) {
      console.error("Error fetching the article:", error);
    } finally {
      //  setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="h-80 w-120 flex flex-col flex-start justify-between">
      <div className="items-start flex flex-col">
        <h1 className="subpixel-antialiased text-orange-brand text-4xl font-bold underline break-words">
          Read Something Insightful
        </h1>
        <h1 className="subpixel-antialiased font-medium text-neutral-600 hover:underline break-words">
          <a
            href="https://x.com/raghavn03"
            target="_blank"
            rel="noopener noreferrer"
          >
            by @raghavn03
          </a>
        </h1>
      </div>
      <button
        className="w-fit bg-orange-brand text-white text-semibold px-6 py-2 rounded-md flex justify-center items-center hover:bg-orange-800 hover:ring hover:ring-orange-300"
        onClick={fetchRandomArticle}
      //disabled={loading} // Disable button while loading
      >
        Generate Random Article
      </button>
      {article ? (
        <div className="break-words">
          <h2 className="break-words text-2xl text-gray-800">{article.title}</h2>
          <a
            className="hover:underline"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read More
          </a>
          <div>
            written by {article.by}
          </div>
          {article.score}
          <p>{convertUnixTimeToDate(article.time)}</p>
        </div>
      ) : (
        <p>No article generated yet. Click the button to fetch an article.</p>
      )}
    </div>
  );
};

export default App;
