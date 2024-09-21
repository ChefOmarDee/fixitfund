import { NextResponse } from 'next/server';
import { AddNewUser } from '../../_lib/mongo/utils/addnewuser.js';

export async function GET(request) {
  try {
    // Dummy data for a new user
    const dummyUserData = {
      uid: '12345',
      email: 'dummy@example.com',
      firstName: 'John',
      lastName: 'Doe',
      userClass: 'civ',  // Can be 'civ', 'wor', or 'und'
    };

    // Call addNewUser function with dummy data
    const newUser = await AddNewUser(
      dummyUserData.uid, 
      dummyUserData.email, 
      dummyUserData.firstName, 
      dummyUserData.lastName, 
      dummyUserData.userClass
    );

    // Return a JSON response
    return NextResponse.json({ msg: 'User added successfully', user: "newUser" });

  } catch (error) {
    return NextResponse.json({ msg: 'Error adding user', error: error.message });
  }
}
