import express from 'express';
import { engine } from 'express-handlebars';

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page', recipies: [{ name: 'Spaghetti' }, { name: 'Tacos' }, { name: 'Pizza' }] });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});