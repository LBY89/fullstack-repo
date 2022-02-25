import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './components/services'
import './index.css'

const Notification =({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='notice'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [noticeMessage, setNoticeMessage] = useState(null)

  //console.log('persons', persons)
  
  useEffect(() => {
    console.log('effect')
    personService
    .getAll()
    .then(allpersons =>{
      setPersons(allpersons)
    })
  }, [])
  
  const deletePerson =person=>{
    
    if (window.confirm(`Delete ${person.name} ${person.number}`)) {
    //const newpersons = persons.filter((item)=>item !== person)
   
    personService
    .deletePerson(person.id)
    .then(() =>{
      setPersons(persons.filter(newperson=>newperson.id != person.id))
  
    })
   
    }
    
  }

  return (
    
    <div>
      <h2>Phonebook</h2>
      <Notification message={noticeMessage}/>
      <Filter person={[persons, setPersons]}/>
      
      <h3>Add a new</h3>
      <PersonForm person={[persons, setPersons]} notice={[noticeMessage, setNoticeMessage]} />
      <h3>Numbers</h3>
      
      <Persons persons={persons} deletePerson= {deletePerson}/>
      
    </div>
  )
}

export default App