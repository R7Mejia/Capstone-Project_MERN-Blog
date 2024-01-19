
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import DeletePost from "./pages/DeletePost";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={'http://localhost:2024/' + cover} alt="" />
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <a className="author">{author.username}</a>
                    <time>{formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className="summary">{summary}</p>
            </div>
            <DeletePost id={_id} author={author} />
        </div>
    );
}




















// import { formatISO9075 } from "date-fns";
// import { Link } from "react-router-dom";

// export default function Post({ _id, title, summary, cover, content, createdAt, author }) {

//     return (
//         <div className="post">
//             <div className="image">
//                 <Link to={`/post/${_id}`}>
//                     <img src={'http://localhost:4000/' + cover} alt="" />
//                 </Link>
//             </div>
//             <div className="texts">
//                 <Link to={`/post/${_id}`}>
//                     <h2>{title}</h2>
//                 </Link>
//                 <p className="info">
//                     <a className="author">{author.username}</a>
//                     <time>{formatISO9075(new Date(createdAt))}</time>
//                 </p>
//                 <p className="summary">{summary}</p>
//             </div>
//         </div>
//     );
// }




















// import React from 'react';
// import { format } from 'date-fns';
// import { Link } from 'react-router-dom';
// import DOMPurify from 'dompurify'; // Import a sanitization library

// function Post({ _id, title, summary, cover, content, createdAt, author }) {
//     const truncatedContent = content.slice(0, 150) + '...'; // Truncate content for preview

//     return (
//         <div className="post">
//             <div className="image">
//                 <Link to={`/post/${_id}`}>
//                     <img src={`http://localhost:2024/${cover}`} alt={`Cover image for ${title}`} />
//                 </Link>
//             </div>
//             <div className="texts">
//                 <Link to={`/post/${_id}`}>
//                     <h2>{title}</h2>
//                 </Link>
//                 <p className="info">
//                     <a className="author" href={`/profile/${author._id}`}>{author.username}</a>
//                     <time>{format(createdAt, 'MMM d, yyyy HH:mm')}</time>
//                 </p>
//                 <p className="summary">{summary}</p>
//                 <div className="content">
//                     <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
//                     {/* If content is long, display a link to view full content */}
//                     {content.length > 150 && (
//                         <Link to={`/post/${_id}`} className="read-more">
//                             Read More
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Post;















// import React from 'react';
// import { format } from 'date-fns';
// import { Link } from 'react-router-dom';

// function Post({ _id, title, summary, cover, content, createdAt, author }) {
//     return (
//         <div className="post">
//             <div className="image">
//                 <Link to={`/post/${_id}`}>
//                     <img src={`http://localhost:2024/${cover}`} alt={`Cover image for ${title}`} />
//                 </Link>
//             </div>
//             <div className="texts">
//                 <Link to={`/post/${_id}`}>
//                     <h2>{title}</h2>
//                 </Link>
//                 <p className="info">
//                     <a className="author" href={`/profile/${author._id}`}>{author.username}</a>
//                     <time>{format(createdAt, 'MMM d, yyyy HH:mm')}</time>
//                 </p>
//                 <p className="summary">{summary}</p>
//             </div>
//         </div>
//     );
// }

// export default Post;











// import React from 'react'
// import {format} from 'date-fns'

// function Post({_id,title, summary, cover, content, createdAt}) {
//   return (

//       <div className="post">
//           <div className="image">
//               <Link to={`/post/${_id}`}>
//                   <img src={'http://localhost:2024/' + cover} alt="" />
//               </Link>
//           </div>
//           <div className="texts">
//               <Link to={`/post/${_id}`}>
//                   <h2>{title}</h2>
//               </Link>
//               <p className="info">
//                   <a className='author'>{author.username}</a>
//                   <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
//               </p>
//               <p className='summary'>{summary}</p>
//           </div>
//       </div>
//   )
// }

// export default Post