import { getallprojectdetails } from '../../_lib/mongo/utils/getallprojectdetails';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const projectID = url.searchParams.get('projectID');

        if (!projectID) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        console.log("Fetching details for project ID:", projectID);

        const result = await getallprojectdetails(projectID);
        console.log(result)
        if (result.status === 404) {
            return NextResponse.json(result.json, { status: 404 });
        }

        if (result.status === 500) {
            return NextResponse.json(result.json, { status: 500 });
        }

        // If successful, return the project details
        if (result.projectDetails) {
            return NextResponse.json(result.projectDetails, { status: 200 });
        } else {
            // This case shouldn't occur based on your implementation, but it's good to handle it
            return NextResponse.json({ error: 'Unexpected response format' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}