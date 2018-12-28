const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

const maintenance = false;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;
    fs.appendFile(`server.log`, log+'\n', (err) => {
        if (err) {
            console.log('Unable to write log');
        }
    });
    if (maintenance) {
        res.render('maintenance.hbs');
    } else {
        next();
    }
});

app.use(express.static(__dirname + "/public"));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

app.get('/', (req, res) => {
    //res.send('<h1>Hello from Express</h1>');
    res.send({
        author:"Celid",
        where:"Paris",
        age:28
    });
});

app.get('/about', (req,res) => {
    res.render('about.hbs', {
        pageTitle: "About page"
    });
});

app.get('/home', (req,res) => {
    res.render('home.hbs', {
        pageTitle: "Home page",
        welcomeMessage: "You are most welcome to my site."
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: "Portfolio"
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage:"Unable to fulfill that request"
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});