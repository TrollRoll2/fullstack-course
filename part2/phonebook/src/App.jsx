import { useState } from 'react'

const Person = ({name, number}) => <div>{name} {number}</div>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

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
      : (setPersons(persons.concat(personObject)), setNewName(''), setNewNumber(''))
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <h2>Add a person</h2>
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
      <div>
        Filter numbers: <input
        value={newFilter}
        onChange={handleInputFilter} />
      </div>
      <h2>Numbers</h2>
        {filteredPersons.map(person => <Person key={person.name} name={person.name} number={person.number} />)}
    </div>
  )
}

export default App