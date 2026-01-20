const express = require('express')
var morgan = require('morgan')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((p) => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = Math.floor(Math.random() * 1000)
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const exists = persons.find((p) => p.name === body.name)

  if ((!body.name || !body.number)) {
    return response.status(400).json({ 
      error: 'both a name and a number is needed' 
    })
  }

  if (exists) {
    return response.status(400).json({
      error: 'person already exists in phonebook'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  request.date = new Date()
  response.send(`
    <div>Phonebook has info for ${persons.length} people </div>
    <div>${request.date}</div>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})