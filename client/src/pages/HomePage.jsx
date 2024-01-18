import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:2024/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
}







// import Post from "../Post";
// import { useEffect, useState } from "react";

// export default function HomePage() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:4000/post')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch posts'); 
//         }
//         return response.json();
//       })
//       .then(posts => {
//         setPosts(posts);
//       })
//       .catch(error => {
//         console.error('Error fetching posts:', error); 
//       });
//   }, []);

//   return (
//     <>
//       {posts.length > 0 && posts.map((post) => (
//         <Post key={post._id} post={post} /> 
//       ))}
//     </>
//   );
// }