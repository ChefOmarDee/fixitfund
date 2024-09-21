import fs from "fs/promises";
import path from "path";

export async function StoreImage(id, imageFile) {
	const uploadDir = path.join(
		process.cwd(),
		"app",
		"temppics",
	);

	// Extract the file extension from the original filename
	const fileExtension = path.extname(imageFile.name);

	// Create a new filename using the provided id and the original file extension
	const newFilename = `${id}${fileExtension}`;
	const filePath = path.join(uploadDir, newFilename);

	try {
		// Ensure the upload directory exists
		await fs.mkdir(uploadDir, { recursive: true });

		// Write the file
		const bytes = await imageFile.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await fs.writeFile(filePath, buffer);

		console.log("Image uploaded successfully");
		return filePath; // Return the full file path of the uploaded file
	} catch (error) {
		console.error("Error during image upload:", error);
		throw new Error(`Image upload failed: ${error.message}`);
	}
}