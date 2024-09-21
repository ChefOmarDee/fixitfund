import { connectToDatabase } from "../connection/connection.js";
import { User } from "../models/user.js";

export async function getuserclass(userId) {
    await connectToDatabase();

    try {
        // Find the project by projectId
        const userClass = await User.findOne({ uid: userId }).select('class -_id').lean();

        if (!userClass) {
            console.log("User not found for userId:", userId);
            return null;
        }
        
        console.log("Returned user class for userId:", userId);
        return userClass.class;
    } catch (error) {
        console.error("Error in getallprojectdetails:", error);
        return { status: 500, json: { error: 'Internal server error' } };
    }
}