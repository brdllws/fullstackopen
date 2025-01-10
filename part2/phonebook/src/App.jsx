import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import './index.css'


const Filter = ({ filterText, handleFilter }) => {
  return (
    <div>
      filter: <input value={filterText} onChange={handleFilter} />
    </div>
  )
}

const Notification = ({ message, status }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={status}>
      {message}
    </div>
  )
}

const PersonForm = ({ persons, setPersons, setNotifMessage, setShowNotification, setNotifStatus }) => {
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
    const person = persons.find(person => person.name === newName)
    if (person) {
      if (window.confirm(`${newName} is already in phonebook, do you want to update their number?`)) {
        const upd = {...person, number: newNum}
        phonebookService
          .update(upd.id, upd)
          .then(resp => {
            console.log(resp)
            const newArr = persons.filter(pers => pers.id !== person.id)            
            setPersons(newArr.concat(upd))
          })
          .catch(error => {
            console.log(error)
            setNotifMessage(`${upd.name} has already been removed from the server`)
            setPersons(persons.filter(pers => pers.id !== upd.id))
            setNotifStatus('error')
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 5000)
          })
      }      
    }
    else {
      const newPerson = {name : newName, number: newNum}      
      phonebookService
        .create(newPerson)
        .then(resp => {
          console.log(resp)
          setPersons(persons.concat(resp))
        })
      setNotifMessage(`${newPerson.name} added to phonebook`)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
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

const Persons = ({ persons, setPersons, filterText }) => {
  const filteredPersons = filterText === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
      .del(person.id)
      .then(response => {
        console.log(response)
        setPersons(persons.filter(pers => pers.id !== person.id))
      })
    }
  }

  return (
    filteredPersons.map(person =>
      <div key={person.id}>
        <p> {person.name} : {person.number} </p>
        <button onClick={() => deletePerson(person)}>delete</button>
      </div>
    )
  )
}

const App = () => {
  const [persons, setPersons] = useState([])   
  const [filterText, setFilterText] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notifMessage, setNotifMessage] = useState('')
  const [notifStatus, setNotifStatus] = useState('success')
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
      { showNotification ? <Notification message={notifMessage} status={notifStatus} /> : null }
      <Filter filterText={filterText} handleFilter={handleFilter} />      
      <h2>Add new</h2>
      <PersonForm persons={persons} setPersons={setPersons} setNotifMessage={setNotifMessage} setShowNotification={setShowNotification} setNotifStatus={setNotifStatus} />      
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filterText={filterText} />      
    </div>
  )
}

export default App