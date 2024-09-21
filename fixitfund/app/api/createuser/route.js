import { AddNewUser } from "@/app/_lib/mongo/utils/addnewuser";
import { NextResponse } from "next/server";
 
export async function POST(Request) {
    const { data } = Request.body;
    console.log(data);

     try {
        await AddNewUser(data.uid, data.email, data.firstName, data.lastName, data.userClass);
     }catch{
        return NextResponse.Response.json({message: 'Error'}, {status: 400});
     }

    return NextResponse.json({ message: 'Data received successfully' }, { status: 200 });
}
