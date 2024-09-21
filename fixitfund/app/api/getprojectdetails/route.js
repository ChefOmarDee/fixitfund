import { GetProjectDetails } from '../../_lib/mongo/utils/getprojectdetails';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const projectID = searchParams.get('projectID');
    
    if (!projectID) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    try {
        const result = await GetProjectDetails(projectID);
        console.log(result);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}