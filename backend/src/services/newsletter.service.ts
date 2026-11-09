import { pool } from "../db/pool.js";
import { NewsletterInput } from "../validators/newsletter.validator.js";

export async function subscribeNewsletter(data: NewsletterInput) {
  const email = data.email.toLowerCase().trim();
  const res = await pool.query(
    `INSERT INTO newsletter_subscribers (email)
     VALUES ($1)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, created_at`,
    [email]
  );

  return {
    subscribed: true,
    email,
    isNew: res.rows.length > 0
  };
}
