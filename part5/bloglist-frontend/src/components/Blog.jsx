import { useState } from "react";

const Blog = ({ blog, user, handleAddLike, handleDeleteBlog }) => {
  const [visibility, setVisibility] = useState(false);

  return (
    <tr data-testid="blog">
      <td>
        <h3>
          {blog.title} by {blog.author}
        </h3>

        {!visibility && (
          <button onClick={() => setVisibility(!visibility)}>show</button>
        )}
        
        {visibility && (
          <div>
            url: {blog.url} <br />
            likes: {blog.likes}{" "}
            <button onClick={() => handleAddLike(blog)}>like</button> <br />
            added by: {blog.user.name} <br />
            <button onClick={() => setVisibility(!visibility)}>hide</button>
            {blog.user.name === user.name && (
              <button onClick={() => handleDeleteBlog(blog)}>delete</button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export default Blog;
