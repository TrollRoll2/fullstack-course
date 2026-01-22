const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('forgot password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://patrikbackman:${password}@phonebook.nahx1ei.mongodb.net/persons?appName=Phonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person
        .find({})
        .then(persons => {
            persons.map(ppl => console.log(ppl.name, ppl.number))
        mongoose.connection.close()
        })
}

if (process.argv.length === 5) {
    const personName = process.argv[3]
    const personNumber = process.argv[4]
    const person = new Person({
        name: personName,
        number: personNumber
    })

    person
        .save()
        .then(result => {
            console.log(`Added ${personName} number ${personNumber} to phonebook`)
            mongoose.connection.close()
        })
}