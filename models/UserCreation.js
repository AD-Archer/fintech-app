// This file is used to create users.
import { User } from './TableCreation.js'; // Import User model

const createUser = async (username, email, password) => {
    try {
        const user = await User.create({ name: username, email, password });
        console.log('User created with ID:', user.id);
    } catch (err) {
        console.error('Error inserting user:', err);
    }
};

