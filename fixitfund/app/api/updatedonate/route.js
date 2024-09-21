import { updatedonated } from '../../_lib/mongo/utils/updatedonate'
import { NextResponse } from 'next/server';
 
export async function POST(req, res) {
    const body = await req.json();
    const { projectID, donationAmount } = body;
    const msg = await updatedonated(projectID, donationAmount);
    console.log(msg);
    return NextResponse.json({ msg : "succesfully updated"})
}
