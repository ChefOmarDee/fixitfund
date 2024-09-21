
import { NextResponse } from 'next/server';
 
export async function GET(req, res) {
    const url = new URL(req.url);
    const projectID = url.searchParams.get('userID');
    console.log(projectID);
    const userStatus = {
        status: "civ"
      };
      
      
    return NextResponse.json(userStatus)
}
