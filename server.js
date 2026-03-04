import express from 'express';
import { engine } from 'express-handlebars';
import registerController from './controllers/register_controller.js';
import cookieParser from 'cookie-parser';
import authenticationMiddleware from './middleware/authentication_middleware.js';
import sessionsController from './controllers/sessions_controller.js';
import recipeController from './controllers/recipe_controller.js';
import pool from "./utils/db.js";
import { requireAuth } from "./middleware/require_auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(authenticationMiddleware)

app.get('/', async (req, res) => {
  const result = await pool.query("SELECT * FROM recipes ORDER BY created_at DESC");
  res.render("home", { title: "Home", recipes: result.rows, authenticated: req.authenticated, user: req.user });
});

app.use('/register', registerController);
app.use('/sessions', sessionsController);
app.use('/recipes', recipeController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

