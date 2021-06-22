const config = require('./config.json'),
    express = require('express'),
    app = express(),
    path = require('path'),
    mysql = require('mysql2'),
    db = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        database: config.mysql.dbName,
        port: config.mysql.port,
        password: config.mysql.password,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }),
    hbs = require('hbs'),
    marked = require('marked');

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
        const hljs = require('highlight.js');
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
})


hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static('dist'));
app.set('view engine', 'hbs');

hbs.registerHelper("mdToHtml", function (content, options) {
    return new hbs.SafeString(marked(content));
});

db.promise()
    .query("CREATE TABLE IF NOT EXISTS `projects` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `description` TEXT NOT NULL , `image` TEXT NOT NULL , `demo_url` TEXT, `source_url` TEXT, `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;")
    .then(() => {
        console.log("Table projects créé !")
    })
    .catch(console.log);

db.promise()
    .query("CREATE TABLE IF NOT EXISTS `stages` ( `id` INT NOT NULL AUTO_INCREMENT , `enterprise` VARCHAR(255) NOT NULL , `description` TEXT NOT NULL , `logo` TEXT NOT NULL , `website_url` TEXT, PRIMARY KEY (`id`)) ENGINE = InnoDB;")
    .then(() => {
        console.log("Table stages créé !")
    })
    .catch(console.log);

db.promise()
    .query("CREATE TABLE IF NOT EXISTS `compte_rendu` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `content` TEXT NOT NULL , `stage_id` int, PRIMARY KEY (`id`), FOREIGN KEY (`stage_id`) REFERENCES stages(id)) ENGINE = InnoDB;")
    .then(() => {
        console.log("Table compte_rendu créé !")
    })
    .catch(console.log);
app.get('/', (request, response) => {
    response.render('index');
});

app.get('/portfolio', async (request, response) => {
    const [rows, fields] = await db.promise().execute('SELECT * FROM projects');
    response.render('portfolio', {
        projects: rows
    });
});

app.get('/stages', async (request, response) => {
    const [rows, fields] = await db.promise().execute('SELECT * FROM stages;');
    response.render('stages', {
        stages: rows
    });
});

app.get('/stage/:id', async (request, response) => {
    const id = request.params.id
    const [rows, fields] = await db.promise().execute('SELECT * FROM compte_rendu where stage_id=?;', [id]);
    const [rows_stage, fields_stage] = await db.promise().execute('SELECT * FROM stages where id=?;', [id]);

    console.log(rows[0])
    response.render('stage', {
        stage: rows_stage[0],
        compte_rendus: rows
    });
});

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`)
})