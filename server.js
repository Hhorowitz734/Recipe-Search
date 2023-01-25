const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ewrbwerbiwue#@$@#$rhiwuherw@#%$@iuheriwuhrbiuwbriuwberiwuberiuwbriuewbriuwberiuwbriuwbriuwbriubwr';
mongoose.connect('mongodb://localhost:27017/recipe-app-data', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //usecreateindex?
});
const app = express();
const port = 8383;

app.use(express.static('public'));

//Gets users to proper page
app.get('/login', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/login.html');
});

app.get('/deck', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/deck.html');
});


app.listen(port, () => console.log(`Server has started on ${port}`))

//Deals with registration data
app.use(bodyParser.json());
app.post('/api/register', async (req, res) => {
    let {username, password, email} = req.body;

    if (!username || typeof username != 'string'){
        return res.json({status: 'error', error: 'Invalid username'})
    }
    if (!password || typeof password != 'string'){
        return res.json({status: 'error', error: 'Invalid password'})
    }
    if (!email || typeof email != 'string'){
        return res.json({status: 'error', error: 'Invalid email'})
    }
    password = await bcrypt.hash(password, 10);
    
    try {
        const response = await User.create({
            username, 
            password, 
            email
        })
        console.log(response);

    } catch(error){
        if (error.code == 11000){
            //Duplicate key error
            return res.json({status: 'error', error: 'Username already in use.'})
        }
        else{
            throw error
        }
    }
    


    res.json({status: 'ok'});
})

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;



    const user = await User.findOne({username}).lean()

    if (!user){
        return res.json({status: 'error', error: 'Invalid username/password'});
    }

    if (await bcrypt.compare(password, user.password)){

        const token = jwt.sign({id: user._id, username: user.username}, JWT_SECRET);
        
        return res.json({status: 'ok', data: token});
    }
    else {
        return res.json({status: 'error', error: 'Invalid username/password'});
    }

})

