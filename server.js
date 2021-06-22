const config = require('./config.json'),
    express = require('express'),
    app = express(),
    path = require('path'),
    mysql = require('mysql'),
    db = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        port: config.mysql.port,
        database: config.mysql.dbName,
    }),
    hbs = require('hbs'),
    md = require("markdown-it")();


hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static('dist'));
app.set('view engine', 'hbs');

db.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});


app.get('/', (request, response) => {
    response.render('index', {
        subject: 'hbs template engine',
        name: 'our template',
        link: 'https://google.com',
        content: md.render("# Let's go !")
    });
});

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`)
})