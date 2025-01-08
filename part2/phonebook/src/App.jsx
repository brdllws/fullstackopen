import { useState } from 'react'

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
      setPersons(persons.concat({id: persons[persons.length-1].id + 1, name : newName, phone: newNum}))
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
    filteredPersons.map(person => <p key={person.id}>{person.name} : {person.phone}</p>)
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { id: 0, name: 'Arto Hellas', phone: "123-456-7890" }
  ])   
  const [filterText, setFilterText] = useState('')  
  const handleFilter = (event) => {
    setFilterText(event.target.value)
  }  
  
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