import { User } from '../models/user'; // Adjust the path based on your structure
import { connectToDatabase } from '../connection/connection'; // Ensure this connection function works

export async function fetchUserByUID(uid) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Find the user by UID in MongoDB
    const user = await User.findOne({ uid });

    if (!user) {
      return null;
    }

    // Exclude sensitive data or fields if needed
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
