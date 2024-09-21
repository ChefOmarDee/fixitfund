import { connectToDatabase } from "../connection/connection.js";
import { Project } from "../models/project.js";

export async function ClaimProject(projectID, cost) { 
  await connectToDatabase();

  try {
    // Find the project by projectId only if its status is "open", and update both the cost and status
    const updatedProject = await Project.findOneAndUpdate(
      { 
        projectId: projectID,    // Find the project with the matching projectID
        status: "open"           // Ensure that the project is in "open" status
      }, 
      { 
        $set: { 
          cost: cost,            // Update the cost field to the new cost value
          status: "in progress"  // Update the status to "in progress"
        } 
      },
      { new: true }              // Return the updated document
    );

    if (!updatedProject) {
      throw new Error(`Project with ID ${projectID} is either not found or not open for claiming.`);
    }

    return updatedProject; // Return the updated project
  } catch (error) {
    console.error("Error in ClaimProject:", error);
    throw error;
  }
}
