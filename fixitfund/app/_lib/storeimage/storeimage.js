import fs from "fs/promises";
import path from "path";

export async function StoreImage(id, imageFile) {
    const uploadDir = path.join(process.cwd(), "app", "temppics");
    const fileExtension = path.extname(imageFile.name);
    const newFilename = `${id}${fileExtension}`;
    const filePath = path.join(uploadDir, newFilename);

    try {
        await fs.mkdir(uploadDir, { recursive: true });
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.writeFile(filePath, buffer);
        console.log("Image stored locally successfully");
        return filePath;
    } catch (error) {
        console.error("Error during local image storage:", error);
        throw new Error(`Local image storage failed: ${error.message}`);
    }
}