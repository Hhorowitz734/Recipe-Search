const express = require('express')
const app = express()
const port = 8383

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.status(200).send('<h1>Chillin</h1>');
})

app.listen(port, () => console.log(`Server has started on ${port}`))