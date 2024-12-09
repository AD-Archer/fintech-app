// This file is used to create users.
import { connection } from '../db.js';

const createUser = (username, email, password) => {
  const sql = 'INSERT INTO user (name, email, pass) VALUES (?, ?, ?)';
  const values = [username, email, password];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return;
    }
    console.log('User created with ID:', result.insertId);
  });
};

// Example usage
createUser('MikeyMike', 'mikemikemikemikemike@example.com', 'securepassword123');