require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const query = require('./queries');
const cors = require('cors');
const app = express()

let port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const corsOptions = {
    origin: 'http://localhost:63342',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/words', query.getWords)
app.post('/word', query.addWord)
app.get('/names', query.getNames)
app.get('/db', async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM test_table');
            const results = { 'results': (result) ? result.rows : null};
            res.render('pages/db', results );
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
