import { connectToDatabase } from "../connection/connection.js";
import { Project } from "../models/project.js";

export async function GetUsersProjects(uid) {
    await connectToDatabase();

    try {
        const projects = await Project.find({ uid }); // Fetch projects for the user
        return projects;
      } catch (error) {
        console.error('Error fetching projects:', error);
        return { status: 500, json: { error: 'Internal server error' } };
      }
}
