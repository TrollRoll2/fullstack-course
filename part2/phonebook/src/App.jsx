import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({name, number}) => <div>{name} {number}</div>

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

const Numbers = ({filteredPersons}) => filteredPersons.map(person => <Person key={person.name} name={person.name} number={person.number} />)

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleInput = (event) => setNewName(event.target.value)
  const handleInputNumber = (event) => setNewNumber(event.target.value)
  const handleInputFilter = (event) => setNewFilter(event.target.value)
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName, number: newNumber
    }
    
    persons.some(names => names.name === personObject.name)
      ? window.alert(`${newName} is already added to the phonebook`)
      : (axios
        .post('http://localhost:3001/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
      )
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <h2>Add a person</h2>
        <Adder handleName={handleName} newName={newName} handleInput={handleInput} newNumber={newNumber} handleInputNumber={handleInputNumber} />
        <Filter newFilter={newFilter} handleInputFilter={handleInputFilter} />
      <h2>Numbers</h2>
        <Numbers filteredPersons={filteredPersons} />
    </div>
  )
}

export default App