import { useState } from 'react'

const Person = ({name, number}) => <div>{name} {number}</div>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleInput = (event) => setNewName(event.target.value)
  const handleInputNumber = (event) => setNewNumber(event.target.value)

  const handleName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName, number: newNumber
    }
    
    persons.some(names => names.name === personObject.name)
      ? window.alert(`${newName} is already added to the phonebook`)
      : (setPersons(persons.concat(personObject)), setNewName(''), setNewNumber(''))
    }

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
        {persons.map(person => <Person key={person.name} name={person.name} number={person.number} />)}
    </div>
  )
}

export default App