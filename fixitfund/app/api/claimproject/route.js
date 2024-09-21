import { NextResponse } from 'next/server';
import {ClaimProject} from '../../_lib/mongo/utils/claimproject.js'

export async function POST(req) {
    try {
        const { projectId, donationAmount, userUID } = await req.json();

        console.log('Received Project ID:', projectId);
        console.log('Donation AmountNeeded:', donationAmount);
        console.log('User UID:', userUID);

        await ClaimProject(projectId, donationAmount, userUID);

        return NextResponse.json({ message: 'Data received and logged successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
