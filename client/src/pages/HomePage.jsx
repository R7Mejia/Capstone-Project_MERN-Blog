import Post from "../Post";
import { useEffect, useState } from "react";
import apipath from '../api.js'

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // console.log(apipath)
    fetch(`${apipath}/post`)
      .then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post} />
      ))}
    </>
  );
}




