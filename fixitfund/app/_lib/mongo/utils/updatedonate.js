import { connectToDatabase } from "../connection/connection.js";
import { Project } from "../models/project.js";

export async function updatedonated(projectId, donationAmount) {
	await connectToDatabase();

	try {
		// Find the project by projectId and get both cost and donated
		const project = await Project.findOne({ projectId: projectId })
			.select("cost donated -_id")
			.lean();

		if (!project) {
			console.log("Project not found");
			return { status: 404, data: { message: "Project not found" } };
		}

		const cost = parseFloat(project.cost.toString());
		let donated = parseFloat(project.donated.toString());
		donationAmount = parseFloat(donationAmount);

		console.log(`Project cost: ${cost}, currently donated: ${donated}`);

		// Calculate the new donated amount
		let new_donated = donated + donationAmount;
		let goalmet = false;

		if (new_donated >= cost) {
			// If donation exceeds the cost, cap it to the remaining amount
			const remaining = cost - donated;
			donationAmount = remaining; // only add what's needed to reach the cost
			new_donated = cost; // cap the new donated amount to the cost
			goalmet = true;

			// Update the project status to closed
			await Project.updateOne(
				{ projectId: projectId },
				{ status: "closed", donated: cost }
			);

			console.log("Project status updated to closed");
		} else {
			// Increment the donated field by the donation amount
			await Project.updateOne(
				{ projectId: projectId },
				{ $inc: { donated: donationAmount } }
			);
		}

		return {
			status: 200,
			data: {
				message: "Donation successfully added to project",
				goalm: goalmet,
				donatedAmount: donationAmount,
			},
		};
	} catch (error) {
		console.error("Error in updatedonated:", error);
		return { status: 500, data: { error: "Internal server error" } };
	}
}
