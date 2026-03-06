import { getSessionWithUser } from "../modules/sessions.js";

export default async function authenticationMiddleware(req, res, next) {
  if (req.cookies.session_token) {
    const loggedInUser = await getSessionWithUser(req.cookies.session_token);
    if (loggedInUser) {
      req.user = loggedInUser;
      req.authenticated = true;
    }
  }
  else {
    req.authenticated = false;
  }
  next();
}

