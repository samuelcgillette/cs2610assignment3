export function requireAuth(req, res, next) {
  if (!req.user) {
    res.redirect("/sessions/new");
    return;
  }
  next();
}