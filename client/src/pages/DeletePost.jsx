
import React from 'react';

function DeletePost({ id }) {
  async function borrandoPost(ev) {
    ev.preventDefault();
    if (window.confirm("Do you want to delete this post?")) {
      try {
        const response = await fetch(`http://localhost:2024/post/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Redirect to the main page
          window.location.href = "/"; 
        } else {
          console.error("Failed to delete it");
          // Handle deletion failure here, e.g., display an error message
        }
      } catch (err) {
        console.error("Error deleting post:", err.message);
        // Handle network errors here, e.g., display a network error message
      }
    }
  }

  return (
    <>
      <button className="btn-del" onClick={borrandoPost}>Delete</button>
    </>
  );
}

export default DeletePost;




//  import React from 'react'
 
// function DeletePost({ id }) {
   
//   // Asynchronous function to handle the deleting of a post
//   async function borrandoPost(ev) {
//     ev.preventDefault();
//     if (window.confirm("Do you want to delete this post?")) {
//       try {
//         //use fetch with the delete method
//         const response = await fetch(`http://localhost:2024/post/${id}`, {
//           method: "DELETE",
//         });
//         //check if the deletion was successful
//         if (response.ok) {
//           //Reload the page or handle deletion completion
//           window.location.reload()
//           alert("Deletion successful!")
//         } else {
//           console.error("Failed to delete it")
//         }
//       } catch (err) {
//         console.error("Error delting post:", err.message)
//       }
//     }
//   }
//    return (
//      <>
//      <button className="btn-del" onClick={borrandoPost}>Delete</button>
//      </>
//    )
//  }
 
//  export default DeletePost