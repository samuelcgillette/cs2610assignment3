import crypto from "crypto"
import db from "../utils/db.js";

export async function createSession(userId) {
  const token = crypto.randomBytes(64).toString("hex");
  const client = await db.connect();
  await client.query(`
    INSERT INTO sessions (user_id, token)
    VALUES ($1, $2)
  `, [userId, token]);
  return token;
}

export async function deleteSession(token, userId) {
  const client = await db.connect();
  await client.query(`
    DELETE FROM sessions WHERE token = $1 AND user_id = $2
  `, [token, userId]);
}

export async function getSessionWithUser(token) {
  const client = await db.connect();
  const result = await client.query(`
    SELECT user_id, users.*
    FROM sessions
    JOIN users ON sessions.user_id = users.id
    WHERE sessions.token = $1
  `, [token]);
  return result.rows[0];
}

