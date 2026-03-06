import crypto from "crypto"
import pool from "../utils/db.js";


export async function createSession(userId) {
  const token = crypto.randomBytes(64).toString("hex");
  await pool.query(`
    INSERT INTO sessions (user_id, session_id)
    VALUES ($1, $2)
  `, [userId, token]);
  return token;
}

export async function deleteSession(token, userId) {
  await pool.query(`
    DELETE FROM sessions WHERE session_id = $1 AND user_id = $2
  `, [token, userId]);
}

export async function getSessionWithUser(token) {
  const result = await pool.query(`
    SELECT user_id, users.*
    FROM sessions
    JOIN users ON sessions.user_id = users.id
    WHERE sessions.session_id = $1
  `, [token]);
  return result.rows[0];
}


