
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
          window.location.reload();
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


