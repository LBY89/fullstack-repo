import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll =()=>{
    const request = axios.get(baseUrl)
    return request.then(response=>response.data)
}

const create =(nameObj)=> {
    console.log('services nameobj', nameObj)
    const request = axios.post(baseUrl, nameObj)
    return request.then(response=> response.data)
    //console.log('data', request.then())
}

const deletePerson =(id)=> {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response=> response.data)
}

const update = (id, newObject) => {

    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response=> response.data)
  
  }

export default {getAll,create, deletePerson, update}