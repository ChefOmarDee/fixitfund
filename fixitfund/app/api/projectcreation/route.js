import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from "uuid";
import {StoreImage} from "../../_lib/storeimage/storeimage.js"
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
    const formData = await req.formData();
    const image = formData.get("image");
    const title = formData.get("title");
    const description = formData.get("description");
    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");
    const tag = formData.get("tag");  // Get the tag from the form data
  
    if (!image) {
      return NextResponse.json(
        { error: "No image file uploaded" },
        { status: 400 }
      );
    }
    const timestamp = Date.now();
    const id = `${uuidv4()}_${timestamp}`;

    console.log("Received form data:");
    console.log("ID:", id);
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Image filename:", image.name);
    console.log("Image type:", image.type);
    console.log("Image size:", image.size, "bytes");
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Tag:", tag);  // Log the tag

    const originalFilename = image.name;
    const filePath = await StoreImage(id, image, originalFilename);
    return NextResponse.json({ message: 'Data received successfully' }, { status: 200 });
}
