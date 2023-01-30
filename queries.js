require('dotenv').config();

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})

const getWords = (request, response) => {
    pool.query('SELECT * FROM words ORDER BY word ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addWord = (request, response) => {
    const { word } = request.body

    pool.query('INSERT INTO words (word) VALUES ($1) RETURNING *', [word], (error, results) => {
        if (error) {
            if (error.code === '23505'){
                console.log(`ERROR! ${word} is a duplicate`);
                return;
            }
            throw error;
        }
        response.status(201).send(`${word} added with ID: ${results.rows[0].id}`)
    })
}

module.exports = {
    getWords,
    addWord
}