import { NextResponse } from 'next/server';
import { fetchUserByUID } from "../../../_lib/mongo/utils/getuser"; 
import { GetUsersProjects } from "../../../_lib/mongo/utils/getusersprojects"; 

// API route for fetching user data and projects by UID
export async function GET(req, { params }) {
  try {
    const { uid } = params;

    // Find the user by UID in MongoDB
    const userData = await fetchUserByUID(uid);
    const userProjects = await GetUsersProjects(uid);

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user data and projects together
    return NextResponse.json({ userData, userProjects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
  }
}
