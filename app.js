import express from 'express';
import { create } from 'express-handlebars';

const app = express();

const hbs = create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
});

app.use(express.static('./public'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (_req, res, _next) => {
    res.render('imagen', {
        showTitle: true,
        activeImg: 'active',
    });
});

app.get('/video', (_req, res, _next) => {
    res.render('video', {
        showTitle: true,
        activeVideo: 'active',
    });
});

const PORT = 3000;


app.listen(PORT, '0.0.0.0', () => console.log(`Listening on http://localhost:${PORT}/`));