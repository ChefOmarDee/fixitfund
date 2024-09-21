// connect to aws and update
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
import { readFile } from "fs/promises";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Configure AWSnp
const s3Client = new S3Client({
	region: "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function storeS3pic(S3ID, contentType) {
	const filePath = path.join(`./app/temppics/${S3ID}`);
	try {
		console.log(filePath);
		const fileContent = await readFile(filePath);

		const params = {
			Bucket: "fixitfund",
			Key: S3ID,
			Body: fileContent,
			ContentType: contentType, // Adjust this based on your video format
		};

		const command = new PutObjectCommand(params);
		const response = await s3Client.send(command);

		console.log("Pic uploaded successfully. ETag:", response.ETag);
	} catch (err) {
		console.error("Error uploading video:", err);
	}
}
