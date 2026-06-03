import { sql } from '@vercel/postgres';

// We export the SQL template helper to query our Neon database easily
export { sql };

// A helper function to execute standard queries when we don't want to use template literals
export async function query(queryString: string, values: any[] = []) {
  try {
    const { rows } = await sql.query(queryString, values);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
