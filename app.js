require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const query = require('./queries');
const cors = require('cors');
const app = express()

const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const corsOptions = {
    origin: 'http://localhost:3000',  //TODO <-- HOW TO SET THIS WHEN DEPLOYED ON HEROKU (WHEN NEEDED)?
    // origin: process.env.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/words', query.getWords)
app.post('/word', query.addWord)
app.get('/names', query.getNames)

app.use(express.static('client'))
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/client/index.html`)
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
    query.testDB()
    query.createTables()
})
