import { getuserclass } from '../../_lib/mongo/utils/getuserclass'
import { NextResponse } from 'next/server';
 
export async function GET(req) {
    const url = new URL(req.url);
    const userID = url.searchParams.get('userID');
    const userStatus = await getuserclass(userID);
    console.log("???????????????")
    console.log(userStatus)
    console.log("???????????????")

    return NextResponse.json({status: userStatus})
}
