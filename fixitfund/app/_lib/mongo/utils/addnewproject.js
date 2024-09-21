import { connectToDatabase } from "../connection/connection.js";
import { Project } from "../models/project.js";

export async function AddNewProject(projectData, s3FileName) {
    await connectToDatabase();
  
    try {
      const newProject = new Project({
        lat: projectData.lat || projectData.latitude,
        long: projectData.long || projectData.longitude,
        title: projectData.title,
        desc: projectData.description,
        projectId: projectData.projectId,
        uid: projectData.uid,
        wid: projectData.wid,
        cost: projectData.cost,
        donated: projectData.donated,
        status: projectData.status,
        pictureUrl: projectData.pictureUrl,
        tag: projectData.tag,
      });
  
      const savedProject = await newProject.save();
      return savedProject;
    } catch (error) {
      console.error("Error in AddNewProject:", error);
      throw error;
    }
  }