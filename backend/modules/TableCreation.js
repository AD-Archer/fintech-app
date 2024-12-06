import { connection } from '../db.js'; 

const createDatabase = () => { 
  const sql = 'CREATE DATABASE IF NOT EXISTS fintechapp';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');
    useDatabase();
  });
};

const useDatabase = () => { 
  const sql = 'USE fintechapp';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error selecting database:', err);
      return;
    }
    console.log('Using fintechapp database');
    createTables();
  });
};

const createTables = () => {
  const tasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending', 'completed', 'Not Started') DEFAULT 'Not Started',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const userTable = `
    CREATE TABLE IF NOT EXISTS user (
      id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      pass VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const transactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      user_id INT NOT NULL,
      amount DECIMAL(10 , 2 ) NOT NULL,
      transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user (id)
    );
  `;
  connection.query(tasksTable, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err);
      return;
    }
    console.log('Tasks table created or already exists');
  });
  connection.query(userTable, (err) => {
    if (err) {
      console.error('Error creating user table:', err);
      return;
    }
    console.log('User table created or already exists');
  });
  connection.query(transactionsTable, (err) => {
    if (err) {
      console.error('Error creating transactions table:', err);
      return;
    }
    console.log('Transactions table created or already exists');
    insertSampleData();
  });
};

const insertSampleData = () => {
  const insertTasks = `
    INSERT INTO tasks (title, description, status) VALUES 
    ('Complete Onboarding', 'Finish setting up the application', 'pending'),
    ('Submit Documentation', 'Upload the required documents for verification', 'Not Started'),
    ('Review Transactions', 'Review the list of recent transactions', 'completed');
  `;
  const insertUsers = `
    INSERT INTO user (name, email, pass) VALUES 
    ('John Doe', 'john.doe@example.com', 'password123'),
    ('Jane Smith', 'jane.smith@example.com', 'securePass456'),
    ('Alice Johnson', 'alice.johnson@example.com', 'myPass789');
  `;
  const insertTransactions = `
    INSERT INTO transactions (user_id, amount) VALUES 
    (1, 100.50),
    (2, 250.00),
    (3, 500.75),
    (1, -20.00),
    (2, -100.00);
  `;
  connection.query(insertTasks, (err) => {
    if (err) {
      console.error('Error inserting task data:', err);
      return;
    }
    console.log('Sample task data inserted');
  });
  connection.query(insertUsers, (err) => {
    if (err) {
      console.error('Error inserting user data:', err);
      return;
    }
    console.log('Sample user data inserted');
  });
  connection.query(insertTransactions, (err) => {
    if (err) {
      console.error('Error inserting transaction data:', err);
      return;
    }
    console.log('Sample transaction data inserted');
  });
};

// Export the createDatabase function
export { createDatabase };