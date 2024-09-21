import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
import { readFile, unlink } from "fs/promises";
import mime from "mime-types";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function storeS3pic(filePath) {
    try {
        const fileContent = await readFile(filePath);
        const fileName = path.basename(filePath);
        const contentType = mime.lookup(filePath) || 'application/octet-stream';

        const params = {
            Bucket: "fixitfund",
            Key: fileName,
            Body: fileContent,
            ContentType: contentType,
        };

        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);

        console.log(`Image '${fileName}' uploaded successfully to S3. ETag:`, response.ETag);

        // Delete the local file after successful S3 upload
        await unlink(filePath);
        console.log(`Local file '${filePath}' deleted.`);

        return fileName;
    } catch (err) {
        console.error("Error in storeS3pic:", err);
        throw err;
    }
}