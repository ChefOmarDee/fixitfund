import { connectToDatabase } from "../connection/connection.js";
import { Project } from "../models/project.js";

export async function getallprojectdetails(projectId) {
    await connectToDatabase();

    try {
        // Find the project by projectId
        const project = await Project.findOne({ projectId: projectId });

        if (!project) {
            return { status: 404, json: { error: 'Project not found' } };
        }

        // Return the project details
        console.log("returned project details");
        return {
            projectDetails: {
                Title: project.title,
                Desc: project.desc,
                PictureURL: project.pictureUrl,
                Status: project.status,
                Tag: project.tag,
                cost: project.cost,
                Donated: project.donated,
                UID: project.uid,
                WID: project.wid,
                Long: project.long,
                Lat: project.lat
            }
        };
    } catch (error) {
        console.error("Error in getallprojectdetails:", error);
        return { status: 500, json: { error: 'Internal server error' } };
    }
}