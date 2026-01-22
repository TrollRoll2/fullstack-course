require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find(({})).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(p => response.json(p))
    .catch(response.status(404).end())
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((!body.name || !body.number)) {
    return response.status(400).json({ 
      error: 'both a name and a number is needed' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(saved => {
    response.json(saved)
  })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  request.date = new Date()
  response.send(`
    <div>Phonebook has info for ${persons.length} people </div>
    <div>${request.date}</div>
    `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})