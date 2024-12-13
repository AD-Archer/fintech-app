// This file is used to create users.
import { User } from './DatabaseCreation.js'; // Import User model

const createUser = async (username, email, password) => {
    try {
        const user = await User.create({ name: username, email, pass: password });
        console.log('User created with ID:', user.id);
    } catch (err) {
        console.error('Error inserting user:', err);
    }
};

// Example usage
createUser('MikeyMike', 'mikemikemikemikemike@example.com', 'securepassword123');