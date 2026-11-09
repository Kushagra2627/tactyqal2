import { pool } from "../db/pool.js";
import { ContactInput } from "../validators/contact.validator.js";

export async function saveContactMessage(data: ContactInput) {
  const result = await pool.query(
    `INSERT INTO contact_messages (name, email, company, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, company, subject, message, created_at`,
    [
      data.name.trim(),
      data.email.toLowerCase().trim(),
      data.company ? data.company.trim() : null,
      data.subject.trim(),
      data.message.trim()
    ]
  );
  return result.rows[0];
}
