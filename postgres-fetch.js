const { Client } = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1234",
    database: "Workout Wiki TEST"
})

client.connect()

client.query('SELECT * FROM "AllWorkout" LIMIT 3', (err, res) => {
    if(!err) {
        console.log(res.rows)
    } else {
        console.log(err)
    } 
    client.end
})

client.query('SELECT DISTINCT "Exercise Type" FROM "AllWorkout"', (err, res) => {
    if(!err) {
        console.log(res.rows)
    } else {
        console.log(err)
    } 
    client.end
})
