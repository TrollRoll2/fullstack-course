import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = userToken => {
  token = `Bearer ${userToken}`
}

const createBlog = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios
    .post(baseUrl, newBlog, config)

  return response.data
}

const updateBlog = async blog => {
  const response = await axios
    .put(`${baseUrl}/${blog.id}`, blog)

  return response.data
}

const deleteBlog = async blog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios
    .delete(`${baseUrl}/${blog.id}`, config)

  return response.data
}

const getAll = async () => {
  const response = await axios
    .get(baseUrl)

  return response.data
}

export default { getAll, createBlog, updateBlog, deleteBlog, setToken }