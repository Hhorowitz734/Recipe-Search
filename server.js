const express = require('express')
const app = express()
const port = 8383

app.use(express.static('public'));


//Gets users to proper page
app.get('/login', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/login.html');
});

app.get('/deck', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/deck.html');
});


app.listen(port, () => console.log(`Server has started on ${port}`))