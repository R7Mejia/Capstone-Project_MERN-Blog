
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Editor({ value, onChange }) {
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        { color: [] }, { background: [] },
    ];

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean'],
                [{ 'color': [] }, { 'background': [] }],
            ],
            image: {
                toolbar: ['imageSize', 'imageAlign', 'imageAlt', 'imageCaption', 'remove'],
            },
        },
    };

    return (
        <div className="content">
            <ReactQuill
                value={value}
                theme="snow"
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Write your content here..."
            />
        </div>
    );
}











// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';


// export default function Editor({ value, onChange }) {
//     const modules = {
//         toolbar: [
//             [{ header: [1, 2, false] }],
//             ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//             [
//                 { list: 'ordered' },
//                 { list: 'bullet' },
//                 { indent: '-1' },
//                 { indent: '+1' },
//             ],
//             ['link', 'image'],
//             [{ size: ['small', false, 'large', 'huge'] }], // Added image size option
//             ['clean'],
//         ],
//     };

//     return (
//         <div className="content">
//             <ReactQuill
//                 value={value}
//                 theme={'snow'}
//                 onChange={onChange}
//                 modules={modules}
//             />
//         </div>
//     );
// }
