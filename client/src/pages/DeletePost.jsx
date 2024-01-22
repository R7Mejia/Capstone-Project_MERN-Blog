
import React from 'react';
import apipath from '../api.js'

function DeletePost({ id }) {
  async function borrandoPost(ev) {
    ev.preventDefault();
    if (window.confirm("Do you want to delete this post?")) {
      try {
        const response = await fetch(`${apipath}/post/${ id }`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Redirect to the main page
          window.location.reload();
        } else {
          console.error("Failed to delete it");
          // Handle deletion failure here, ejmp. display an error mensage
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


