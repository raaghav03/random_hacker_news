import React, { useState } from 'react';
import axios from 'axios';

interface Article {
  id: number;
  title: string;
  url: string;
  time: number

}
const convertUnixTimeToDate = (unixTime: number): string => {
  const date = new Date(unixTime * 1000); // Convert seconds to milliseconds
  return date.toLocaleString(); // Converts to local date and time string
};
const App: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);

  const fetchRandomArticle = async () => {
    try {
      // Fetch the top stories
      const topStoriesResponse = await axios.get<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
      const newStoriesResponse = await axios.get<number[]>('https://hacker-news.firebaseio.com/v0/newstories.json');
      const bestStoriesResponse = await axios.get<number[]>('https://hacker-news.firebaseio.com/v0/beststories.json');

      // Combine all story IDs into one array
      const allStoryIds = [
        ...topStoriesResponse.data,
        ...newStoriesResponse.data,
        ...bestStoriesResponse.data
      ];

      // Pick a random story ID from the combined list
      const randomIndex = Math.floor(Math.random() * allStoryIds.length);
      const randomStoryId = allStoryIds[randomIndex];

      // Fetch the details of the random story
      const storyResponse = await axios.get<Article>(`https://hacker-news.firebaseio.com/v0/item/${randomStoryId}.json`);
      setArticle(storyResponse.data);
    } catch (error) {
      console.error('Error fetching the article:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchRandomArticle}>Generate Random Article</button>
      {article ? (
        <div>
          <h2>{article.title}</h2>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
          <p>{convertUnixTimeToDate(article.time)}</p>
        </div>
      ) : (
        <p>No article generated yet. Click the button to fetch an article.</p>
      )}
    </div>
  );
};

export default App;
