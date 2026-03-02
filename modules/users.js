import db from "../utils/db.js";
import bcrypt from "bcrypt";

export async function createUser(username, email, password) {
  const client = await db.connect();
  const { rows } = await client.query(`
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3) RETURNING *
  `, [username, email, await bcrypt.hash(password, 10)]);

  return rows[0];
}


export async function authenticateUser(email, password) {
  const client = await db.connect();
  const { rows } = await client.query(`
    SELECT * FROM users WHERE email = $1
  `, [email]);

  if (rows.length === 0) return null;
  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) return null;
  return user;
}