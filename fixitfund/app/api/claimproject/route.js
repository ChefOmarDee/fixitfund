import { NextResponse } from 'next/server';
import { ClaimProject } from '../../_lib/mongo/utils/claimproject.js';

export async function POST(req) {
    try {
        console.log(req.json)
        const { projectId, donationAmount, userUID } = await req.json();

        // Input validation
        if (!projectId || !donationAmount || !userUID) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (typeof donationAmount !== 'number' || donationAmount <= 0) {
            return NextResponse.json({ error: 'Invalid donation amount' }, { status: 400 });
        }

        console.log('Received Project ID:', projectId);
        console.log('Donation Amount:', donationAmount);
        console.log('User UID:', userUID);

        // Attempt to claim the project
        const result = await ClaimProject(projectId, donationAmount, userUID);
        console.log(result)
        if (result.success) {
            return NextResponse.json({ message: 'Project claimed successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}