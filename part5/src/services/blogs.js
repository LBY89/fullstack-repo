import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then((response) => {
    return response.data
  })
}

const update = (id, newObject) => {

  const request = axios.put(`${baseUrl}/${id}`, newObject)

  return request.then(response => response.data)
}

const deleteBlogPost = (id) => {
  console.log('id', id)
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then((response) => {
    console.log('response.data', response.data)
    return response.data
  })
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


export default { getAll, create, setToken, update, deleteBlogPost }