// SetRoutes.js
import { connection } from '../db.js'; // Import the connection from db.js

import express from 'express'; // Import express to use its features

const setupRoutes = (app) => {
    // Create task
    app.post('/tasks', (req, res) => {
        const { title, description, status } = req.body;
        const query = "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";

        connection.query(query, [title, description, status], (err, results) => {
            if (err) throw err;
            res.status(201).json({ id: results.insertId });
        });
    });

    // Read tasks
    app.get('/tasks', (req, res) => {
        connection.query('SELECT * FROM tasks', (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    });
};





export default setupRoutes; // Export the setupRoutes function
