// Import necessary libraries and components
import ReactQuill from "react-quill"; // Rich text editor library
import 'react-quill/dist/quill.snow.css'; // Stylesheet for the rich text editor
import { useState } from "react"; // State hook for managing component state
import { Navigate } from "react-router-dom"; // Navigation component for redirecting
import Editor from "../Editor"; // Custom editor component (assumed to be a rich text editor)

// Define the CreatePost functional component
export default function CreatePost() {
    // Define state variables using the useState hook
    const [title, setTitle] = useState(''); // Title of the post
    const [summary, setSummary] = useState(''); // Summary of the post
    const [content, setContent] = useState(''); // Content of the post
    const [files, setFiles] = useState(''); // Files associated with the post (assumed to be images)
    const [redirect, setRedirect] = useState(false); // State for redirecting after post creation

    // Asynchronous function to handle the creation of a new post
    async function createNewPost(ev) {
        // Prevent the default form submission behavior
        ev.preventDefault();

        // Create a FormData object to send data with the request
        const data = new FormData();
        data.set('title', title); // Set the title
        data.set('summary', summary); // Set the summary
        data.set('content', content); // Set the content
        data.append('file', files[0]); // Append the file (assumed to be an image)

        // Send a POST request to the server with the post data
        const response = await fetch('http://localhost:2024/post', {
            method: 'POST',
            body: data,
            credentials: 'include', // Include credentials in the request
        });

        // Check if the response is buena
        if (response.ok) {
            setRedirect(true); 
        }
    }

    // If the redirect state is true, navigate to the home page
    if (redirect) {
        return <Navigate to={'/'} />
    }

    // Render the form for creating a new post
    return (
        <form onSubmit={createNewPost}>
            <input type="title"
                placeholder={'Title'}
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <input type="summary"
                placeholder={'Summary'}
                value={summary}
                onChange={ev => setSummary(ev.target.value)} />
            <input type="file"
                onChange={ev => setFiles(ev.target.files)} />
            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '5px' }}>Create post</button>
        </form>
    );
}















// import ReactQuill from "react-quill";
// import 'react-quill/dist/quill.snow.css';
// import { useState } from "react";
// import { Navigate } from "react-router-dom";
// import Editor from "../Editor";

// export default function CreatePost() {
//     const [title, setTitle] = useState('');
//     const [summary, setSummary] = useState('');
//     const [content, setContent] = useState('');
//     const [files, setFiles] = useState('');
//     const [redirect, setRedirect] = useState(false);
    
//     async function createNewPost(ev) {
//         const data = new FormData();
//         data.set('title', title);
//         data.set('summary', summary);
//         data.set('content', content);
//         data.set('file', files[0]);
//         ev.preventDefault();
//         const response = await fetch('http://localhost:2024/post', {
//             method: 'POST',
//             body: data,
//             credentials: 'include',
//         });
//         if (response.ok) {
//             setRedirect(true);
            
//         }
//         console.log(response)
//     }

//     if (redirect) {
//         return <Navigate to={'/'} />
//     }
//     return (
//         <form onSubmit={(ev )=> createNewPost(e)} >
//             <input name='title' type="title"
//                 placeholder={'Title'}
//                 value={title}
//                 onChange={ev => setTitle(ev.target.value)} />
//             <input name='summary'type="summary"
//                 placeholder={'Summary'}
//                 value={summary}
//                 onChange={ev => setSummary(ev.target.value)} />
//             <input name='file' type="file"
//                 onChange={ev => setFiles(ev.target.files)} />
//             <Editor value={content} onChange={setContent} />
//             <button type='submit' style={{ marginTop: '5px' }}>Create post</button>
//         </form>
//     );
// }