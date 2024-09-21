import { storeS3pic } from "../../_lib/s3/pushpics";
import { NextResponse } from 'next/server';
 
export async function POST(Request) {
    storeS3pic("pothole-pic.jpg", "jpg");
    return NextResponse.json({ msg: 'Hello from server' })
}
