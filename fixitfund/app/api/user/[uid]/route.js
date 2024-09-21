import { NextResponse } from 'next/server';
import { fetchUserByUID } from "../../../_lib/mongo/utils/getuser"; // Adjust your import
// import { GetUsersProjects } from "../../../_lib/mongo/utils/getusersprojects"; // Adjust your import

// API route for fetching user data by UID
export async function GET(req, { params }) {
  try {
    const { uid } = params;
    console.log("///////////////////")
    console.log(uid);
    console.log("///////////////////")

    // Find the user by UID in MongoDB
    const userData = await fetchUserByUID(uid);
    // const userProjects=await GetUsersProjects(uid);
    console.log("///////////////////")
    // console.log(userProjects)
    console.log(userData);
    console.log("///////////////////") 
    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
  }
}
