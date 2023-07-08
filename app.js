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
    origin: `https://skribbl-words-1e746fdf2ac0.herokuapp.com:${port}`,  // <-- HOW TO KNOW THIS WHEN DEPLOYED ON HEROKU?
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/words', query.getWords)
app.post('/word', query.addWord)
app.get('/names', query.getNames)

app.use(express.static('client'))
app.get('*', (req, res) => {
    res.sendFile('index.html')
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
    query.testDB()
})