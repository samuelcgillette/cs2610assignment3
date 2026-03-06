import express from 'express';
import { engine } from 'express-handlebars';
import registerController from './controllers/user_controller.js';
import cookieParser from 'cookie-parser';
import authenticationMiddleware from './middleware/authentication_middleware.js';
import sessionsController from './controllers/sessions_controller.js';
import recipeController from './controllers/recipe_controller.js';
import { getRecentRecpies } from './modules/recipes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(authenticationMiddleware)

app.get('/', async (req, res) => {
  res.render("home", { title: "recipe social", recipes: await getRecentRecpies(), authenticated: req.authenticated, user: req.user });
});

app.use('/user', registerController);
app.use('/sessions', sessionsController);
app.use('/recipes', recipeController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

