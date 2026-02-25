import { useState } from "react";

const CreateBlog = ({ handleCreation }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreation(title, author, url);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h1>Add a new blog:</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">save blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;
