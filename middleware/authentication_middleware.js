import { getSessionWithUser } from "../models/sessions.js";

export default async function authenticationMiddleware(req, res, next) {
  if (req.cookies.session_token) {
    const loggedInUser = await getSessionWithUser(req.cookies.session_token);
    if (loggedInUser) {
      console.log("Logged in user:", loggedInUser);
      req.user = loggedInUser;
      req.authenticated = true;
    }
  }
  next();
}

