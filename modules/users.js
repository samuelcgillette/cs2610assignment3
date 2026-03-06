import pool from "../utils/db.js";
import bcrypt from "bcrypt";

export async function createUser(username, email, password) {
  const {rows} = await pool.query(`
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3) RETURNING *
  `, [username, email, await bcrypt.hash(password, 10)]);

  return rows[0];
  //if user already exists need to do something
}


export async function authenticateUser(email, password) {
  console.log("authenticating " + email + " " + password);
  const {rows} = await pool.query(`
    SELECT * FROM users WHERE email = $1
  `, [email]);

  if (rows.length === 0) return null;
  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) return null;
  return user;
}

export async function getUserById(id) {
  const  { rows }  = await pool.query(`
    SELECT * FROM users WHERE id = $1
  `, [id]);

  if (rows.length === 0) return null;
  console.log("Got user by id:", rows[0]);
  return rows[0];
}

