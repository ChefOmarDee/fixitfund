// /app/api/claimproject/route.js
import { NextResponse } from 'next/server';
import {ClaimProject} from '../../_lib/mongo/utils/claimproject.js'

export async function POST(req) {
    try {
        // Parse the request body to get the data sent from the frontend
        const { projectId, donationAmount } = await req.json();

        // Log the received data to the console
        console.log('Received Project ID:', projectId);
        console.log('Donation AmountNeeded:', donationAmount);
        const wid="222"
        await ClaimProject(projectId, donationAmount, wid)
        // Send a response back to the frontend
        return NextResponse.json({ message: 'Data received and logged successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}