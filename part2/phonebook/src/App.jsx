import { useState, useEffect } from 'react'
import personHandler from './services/persons'
import Notification from './components/Notification'

const Adder = ({handleName, newName, handleInput, newNumber, handleInputNumber}) => (
  <form onSubmit={handleName}>
    <div>
      name: <input
      value={newName}
      onChange={handleInput} />
    </div>
    <div>
      number: <input
      value={newNumber}
      onChange={handleInputNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Filter = ({newFilter, handleInputFilter}) => (
  <div>
    Filter numbers: <input
    value={newFilter}
    onChange={handleInputFilter} />
  </div>
)

const Numbers = ({filteredPersons, remove}) => filteredPersons.map(person => {
  return(<li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => remove(person.id, person.name)}>Delete</button>
      </li>)
      }
)

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notif, setNotif] = useState({message:'Welcome to the app!', notifType:'info'})

  useEffect(() => {
    personHandler
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const remover = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personHandler
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleInput = (event) => setNewName(event.target.value)
  const handleInputNumber = (event) => setNewNumber(event.target.value)
  const handleInputFilter = (event) => setNewFilter(event.target.value)
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const updateName = (name, updatedNumber) => {
    const person = persons.find((p) => p.name === name)
    
    personHandler
      .update(person.id, {...person, number: updatedNumber})
      .then((updated) => {
        setPersons(persons.map((p) => p.id !== person.id ? p : updated))
        setNotif({message:`${name}'s number was updated`, notifType:'info'})
        setTimeout(() => {
          setNotif({message: null, notifType: null})
        }, 5000)
      })
      .catch(error => {
        setNotif({message: error.response.data.error, notifType: 'error'})
      })
  }

  const handleName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName, number: newNumber
    }

    persons.some(names => names.name === personObject.name)
      ? window.confirm(`Update ${personObject.name}'s number?`)
        ? updateName(personObject.name, personObject.number)
        : null
      : (personHandler
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNotif({message:`${personObject.name} was added`, notifType:'info'})
            setTimeout(() => {
              setNotif({message: null, notifType: null})
            }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotif({message: error.response.data.error, notifType: 'error'})
        })
      )
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notif.message} notifType={notif.notifType} />
      <h2>Add a person</h2>
        <Adder handleName={handleName} newName={newName} handleInput={handleInput} newNumber={newNumber} handleInputNumber={handleInputNumber} />
        <Filter newFilter={newFilter} handleInputFilter={handleInputFilter} />
      <h2>Numbers</h2>
        <Numbers filteredPersons={filteredPersons} remove={remover} />
    </div>
  )
}

export default App