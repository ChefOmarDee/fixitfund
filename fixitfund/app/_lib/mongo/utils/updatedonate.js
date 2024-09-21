import { connectToDatabase } from "../connection/connection.js";
import { Project } from "../models/project.js";

export async function updatedonated(projectId, donationAmount) {
    await connectToDatabase();

    try {
        // Find the project by projectId and get both cost and donated
        const project = await Project.findOne({ projectId: projectId })
            .select('cost donated -_id')
            .lean();

        if (!project) {
            console.log('Project not found');
            return { status: 404, data: { message: 'Project not found' } };
        }

        const cost = project.cost;
        let donated = Number(project.donated.toString());

        console.log(`Project cost: ${cost}, currently donated: ${donated}`);

        // Calculate the new donated amount
        let new_donated = donated + donationAmount;
        let goalmet = false;
        if (new_donated >= cost) {
            // If donation exceeds the cost, cap it to the remaining amount
            const remaining = cost - donated;
            donationAmount = remaining;  // only add what's needed to reach the cost
            new_donated = cost;  // cap the new donated amount to the cost

            // Update the project status to closed
            const update_status_result = await Project.updateOne(
                { projectId: projectId },
                { status: "closed" }
            );
            goalmet = true;

            if (update_status_result.matchedCount > 0) {
                console.log("Project status updated to closed");
            }
        }

        // Increment the donated field by the adjusted donation amount
        const update_donated_result = await Project.updateOne(
            { projectId: projectId },
            { $inc: { donated: parseInt(donationAmount) } }
        );

        if (update_donated_result.matchedCount === 0) {
            return { status: 404, data: { message: 'Project not found' } };
        }

        if (update_donated_result.modifiedCount === 0) {
            return { status: 400, data: { message: 'Donation update failed' } };
        }

        return { status: 200, data: { message: 'Donation successfully added to project', goalm: goalmet } };
    } catch (error) {
        console.error("Error in updatedonated:", error);
        return { status: 500, data: { error: 'Internal server error' } };
    }
}
