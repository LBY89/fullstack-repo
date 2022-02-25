import React, { useEffect, useState } from "react";
import personService from './services'
import { nanoid } from 'nanoid'
const PersonForm = (props) => {
    const [persons, setPersons] = props.person
    const [noticeMessage, setNoticeMessage] = props.notice
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    console.log('giveme noticeM', noticeMessage)
    const addName = (event) => {
        event.preventDefault()
        const nameObj = {
          name: newName,
          number: newNumber,
          id: nanoid()
        }
        if (persons.find((person)=> person.name === newName)){
          const id = persons.find(person=>person.name===newName).id
          const changedPerson = {...nameObj, number: nameObj.number}
          if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
            personService
            .update(id, changedPerson)
            .then(returnPerson=>{
              setPersons(persons.map(person => person.id !== id ? person : returnPerson))
              setNoticeMessage(`Updated ${returnPerson.name}'s number`)
              setTimeout(()=>{
                setNoticeMessage(null)
              }, 5000)
              setNewName('')
              setNewNumber('')
            })
            .catch(error=>{
              setNoticeMessage(`information ${changedPerson.name} has already been deleted.`)
              setTimeout(()=>{
                setNoticeMessage(null)
              },2000)
              setPersons(persons.filter(n=> n.id !== id))
            })
          }
          return
        }else {
          personService
          .create(nameObj)
          .then(returnPerson=>{
            setPersons(persons.concat(returnPerson))
            setNoticeMessage(`Added ${returnPerson.name}`)
            setTimeout(()=>{
              setNoticeMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
        }
        
    }

    const handleNameChange = (event) => {
        const{value} = event.target
        //console.log('value', value)
        
        setNewName(value)
       
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
        
    }

    return (
        <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
    );
}

export default PersonForm;

