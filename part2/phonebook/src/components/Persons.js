import React, { Component } from 'react'

const Persons = (props) => {
    const{persons, deletePerson} = props
    console.log('added', persons)

    return (
        <div>
            {
                persons.map((person)=> 
                <div className='person' key={person.id}>
                    {person.name} {person.number} 
                    <button onClick = {()=>deletePerson(person)}>delete</button>
                </div>
                )
            }
        </div>
    )

}

export default Persons;