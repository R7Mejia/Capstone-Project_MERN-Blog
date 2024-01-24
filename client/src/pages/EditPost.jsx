import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import apipath from '../api.js'

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`${apipath}/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                });
            });
    }, []);

    async function updatePost(ev) {
        ev.preventDefault();

        // Retrieve the JWT token from local storage
        const jwtToken = localStorage.getItem('token');

        // Create headers with the token
        const headers = {
            'Authorization': `Bearer ${jwtToken}`,
        };

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }

        // Send a PUT request to the server with the post data and headers
        const response = await fetch(`${apipath}/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
            headers: headers, // Include the headers with the token
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/post/' + id} />
    }

    return (
        <form onSubmit={updatePost}>
            <input type="title"
                placeholder={'Title'}
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <input type="summary"
                placeholder={'Summary'}
                value={summary}
                onChange={ev => setSummary(ev.target.value)} />
            <input className='pictures' type="file"
                onChange={ev => setFiles(ev.target.files)} />
            <Editor onChange={setContent} value={content} />
            <button style={{ marginTop: '5px' }}>Update post</button>
        </form>
    );
}
















// import { useEffect, useState } from "react";
// import { Navigate, useParams } from "react-router-dom";
// import Editor from "../Editor";
// import apipath from '../api.js'

// export default function EditPost() {
//     const { id } = useParams();
//     const [title, setTitle] = useState('');
//     const [summary, setSummary] = useState('');
//     const [content, setContent] = useState('');
//     const [files, setFiles] = useState('');
//     const [redirect, setRedirect] = useState(false);

//     useEffect(() => {
//         fetch(`${apipath}/post/${id}`)
//             .then(response => {
//                 response.json().then(postInfo => {
//                     setTitle(postInfo.title);
//                     setContent(postInfo.content);
//                     setSummary(postInfo.summary);
//                 });
//             });
//     }, []);

//     async function updatePost(ev) {
//         ev.preventDefault();
//         const data = new FormData();
//         data.set('title', title);
//         data.set('summary', summary);
//         data.set('content', content);
//         data.set('id', id);
//         if (files?.[0]) {
//             data.set('file', files?.[0]);
//         }
//         const response = await fetch(`${ apipath}/post`, {
//             method: 'PUT',
//             body: data,
//             credentials: 'include',
//         });
//         if (response.ok) {
//             setRedirect(true);
//         }
//     }

//     if (redirect) {
//         return <Navigate to={'/post/' + id} />
//     }

//     return (
//         <form onSubmit={updatePost}>
//             <input type="title"
//                 placeholder={'Title'}
//                 value={title}
//                 onChange={ev => setTitle(ev.target.value)} />
//             <input type="summary"
//                 placeholder={'Summary'}
//                 value={summary}
//                 onChange={ev => setSummary(ev.target.value)} />
//             <input className='pictures' type="file"
//                 onChange={ev => setFiles(ev.target.files)} />
//             <Editor onChange={setContent} value={content} />
//             <button style={{ marginTop: '5px' }}>Update post</button>
//         </form>
//     );
// }

