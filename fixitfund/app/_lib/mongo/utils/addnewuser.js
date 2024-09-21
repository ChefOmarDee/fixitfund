import { connectToDatabase } from "../connection/connection.js";
import { User } from "../models/user.js";

// Function to add a user to MongoDB
export async function AddNewUser(uid, email, firstName, lastName, userClass) {
  await connectToDatabase();

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ uid });

    if (existingUser) {
      return;
    }

    // Create a new user if they don't exist
    const user = await User.create({
      firstName,     // First name of the user
      lastName,      // Last name of the user
      email,         // Email of the user
      uid,           // Unique user ID
      class: userClass, // Class must be 'civ', 'wor', or 'und'
      badges: [],    // Initializes with an empty array
      totalDonations: 0,  // Default donation count
      totalJobsOpened: 0, // Default jobs opened count
      totalJobsCompleted: 0, // Default jobs completed count
      description: "",   // Default empty description
    });
    return user; // Return the created user
  } catch (error) {
    console.error("Error in addNewUser:", error);
    throw error;
  }
}
