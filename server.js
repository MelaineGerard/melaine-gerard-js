const config = require('./config.json'),
    express = require('express'),
    app = express(),
    path = require('path'),
    hbs = require('hbs'),
    md = require("markdown-it")();


hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');

app.get('/', (request, response) => {
    response.render('index', {
        subject: 'hbs template engine',
        name: 'our template',
        link: 'https://google.com',
        content: md.render("# Let's go !")
    });
});

app.listen(3000, () => {
    console.log(`Server started on port ${config.port}`)
})