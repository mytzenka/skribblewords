require("express");

const Pool = require('pg').Pool
let options
if (process.env.NODE_ENV === "production") {
    options = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
} else {
    options = {connectionString: process.env.DATABASE_URL}
}
const pool = new Pool(options);

const getWords = (request, response) => {
    pool.query('SELECT * FROM words ORDER BY word ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

function addName(name) {
    return pool.query('SELECT id FROM names WHERE name = $1', [name]).then((results) => {
        if (results.rows.length === 0) {
            return pool.query('INSERT INTO names(name) VALUES($1) RETURNING *', [name]).then((results) => {
                console.log('inserted: ' + results.rows[0].id)
                return results.rows[0].id
            })
            .catch((error) =>
                setImmediate(() => {
                    throw error
            }))
        }
        else {
            console.log('found: ' + results.rows[0].id)
            return results.rows[0].id
        }
    }).catch((error) =>
        setImmediate(() => {
            throw error
    }))
}

async function addWord(request, response) {
    const { word, name } = request.body

    const nameId = await addName(name)

    pool.query('INSERT INTO words(word, "nameId") VALUES ($1, $2) RETURNING *', [word, nameId], (error, results) => {
        if (error) {
            if (error.code === '23505'){
                response.status(204).send(`${word} already exists`)
            }
            else
                throw error;
        }
        else
            response.status(201).send(`${word} added with ID: ${results.rows[0].id}`)
    })
}

const getNames = (request, response) => {
    pool.query('SELECT * FROM names ORDER BY name ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const testDB = () => {
    pool.query('SELECT datname FROM pg_database', (error, results) => {
        if (!error) {
            console.log(`database connection successful`);
        } else {
            console.log(error);
        }
    })
}

module.exports = {
    getWords,
    addWord,
    getNames,
    testDB
}