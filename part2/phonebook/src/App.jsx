import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook' 


const Filter = ({ filterText, handleFilter }) => {
  return (
    <div>
      filter: <input value={filterText} onChange={handleFilter} />
    </div>
  )
}

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }
  const handleNewNum = (event) => {
    setNewNum(event.target.value)
  }
  const addName = (event) => {
    event.preventDefault()
    const checks = persons.map(person => person.name === newName)
    if (checks.every(elem => elem === false)) {
      const newPerson = {name : newName, number: newNum}      
      phonebookService
        .create(newPerson)
        .then(resp => {
          console.log(resp)
          setPersons(persons.concat(resp))
        })
    }
    else {
      alert(`The name ${newName} has already been used`)
    }
    setNewName('')
    setNewNum('')
  }

  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={newNum} onChange={handleNewNum} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, filterText }) => {
  const filteredPersons = filterText === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    filteredPersons.map(person => <p key={person.id}>{person.name} : {person.number}</p>)
  )
}

const App = () => {
  const [persons, setPersons] = useState([])   
  const [filterText, setFilterText] = useState('')  
  const handleFilter = (event) => {
    setFilterText(event.target.value)
  }
  useEffect(() => {
    phonebookService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])  
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} handleFilter={handleFilter} />      
      <h2>Add new</h2>
      <PersonForm persons={persons} setPersons={setPersons}/>      
      <h2>Numbers</h2>
      <Persons persons={persons} filterText={filterText} />      
    </div>
  )
}

export default App