import { getuserclass } from '../../_lib/mongo/utils/getuserclass'
import { NextResponse } from 'next/server';
 
export async function GET(req, res) {
    const url = new URL(req.url);
    const userID = url.searchParams.get('userID');
    console.log(projectID);
    const userStatus = getuserclass(userID);
      
    return NextResponse.json({status: userStatus})
}
