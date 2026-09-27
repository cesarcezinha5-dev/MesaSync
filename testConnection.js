import pool from './database.js';

try {
  const { rows } = await pool.query(
    'SELECT current_database() AS banco, current_user AS usuario'
  );

  console.table(rows);
} catch (error) {
  console.error('Erro ao conectar:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}