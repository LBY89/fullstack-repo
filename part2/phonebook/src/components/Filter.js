
const Filter = (person) => {

    //console.log('Filterperson', person)

    const [persons, setPersons] = person.person
    const filterNameNumber = (event) => {

        const new_persons = persons.filter(person=> String(person.name).includes(event.target.value));
        
        setPersons(new_persons)
    }
    return (
        <div>
            filter shown with<input  onChange={filterNameNumber}/>
        </div>
    )

}

export default Filter