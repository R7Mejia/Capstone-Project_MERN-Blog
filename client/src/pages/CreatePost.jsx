// Adding comments to this page cuz it was really hard to understand some functionalities...

//Import necessary libraries and components
import ReactQuill from "react-quill"; // Rich text editor library
import 'react-quill/dist/quill.snow.css'; // Stylesheet for the rich text editor
import { useState } from "react"; // State hook for managing component state
import { Navigate } from "react-router-dom"; // Navigation component for redirecting
import Editor from "../Editor"; // Custom editor component (assumed to be a rich text editor)
import apipath from '../api.js'


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

        // Retrieve the JWT token from local storage
        const jwtToken = localStorage.getItem('token');

        // Create headers with the token
        const headers = {
            'Authorization': `Bearer ${jwtToken}`,
        };

        ////// Create a FormData object to send data with the request
        const data = new FormData();
        data.set('title', title); // Set the title
        data.set('summary', summary); // Set the summary
        data.set('content', content); // Set the content
        data.append('file', files[0]); // Append the file (an image)

        // Send a POST request to the server with the post data and headers
        const response = await fetch(`${apipath}/post`, {
            method: 'POST',
            body: data,
            credentials: 'include', // Include credentials in the request
            headers: headers, // Include the headers with the token
        });

        // Check if the response is buena
        if (response.ok) {
            setRedirect(true);
        }
    }

    // If the redirect state is true, navigate to the pagina principal (home page)
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













// // Adding comments to this page cuz it was really hard to understand some functionalities...

// //Import necessary libraries and components
// import ReactQuill from "react-quill"; // Rich text editor library
// import 'react-quill/dist/quill.snow.css'; // Stylesheet for the rich text editor
// import { useState } from "react"; // State hook for managing component state
// import { Navigate } from "react-router-dom"; // Navigation component for redirecting
// import Editor from "../Editor"; // Custom editor component (assumed to be a rich text editor)
// import apipath from '../api.js'


// // Define the CreatePost functional component
// export default function CreatePost() {
//     // Define state variables using the useState hook
//     const [title, setTitle] = useState(''); // Title of the post
//     const [summary, setSummary] = useState(''); // Summary of the post
//     const [content, setContent] = useState(''); // Content of the post
//     const [files, setFiles] = useState(''); // Files associated with the post (assumed to be images)
//     const [redirect, setRedirect] = useState(false); // State for redirecting after post creation

//     // Asynchronous function to handle the creation of a new post
//     async function createNewPost(ev) {
//         // Prevent the default form submission behavior
//         ev.preventDefault();

//         ////// Create a FormData object to send data with the request
//         const data = new FormData();
//         data.set('title', title); // Set the title
//         data.set('summary', summary); // Set the summary
//         data.set('content', content); // Set the content
//         data.append('file', files[0]); // Append the file ( an image)

//         // Send a POST request to the server with the post data
//         const response = await fetch(`${apipath}/post`, {
//             method: 'POST',
//             body: data,
//             credentials: 'include', // Include credentials in the request
//         });

//         // Check if the response is buena
//         if (response.ok) {
//             setRedirect(true); 
//         }
//     }

//     // If the redirect state is true, navigate to the pagina principal (home page)
//     if (redirect) {
//         return <Navigate to={'/'} />
//     }

//     // Render the form for creating a new post
//     return (
//         <form onSubmit={createNewPost}>
//             <input type="title"
//                 placeholder={'Title'}
//                 value={title}
//                 onChange={ev => setTitle(ev.target.value)} />
//             <input type="summary"
//                 placeholder={'Summary'}
//                 value={summary}
//                 onChange={ev => setSummary(ev.target.value)} />
//             <input type="file"
//                 onChange={ev => setFiles(ev.target.files)} />
//             <Editor value={content} onChange={setContent} />
//             <button style={{ marginTop: '5px' }}>Create post</button>
//         </form>
//     );
// }



