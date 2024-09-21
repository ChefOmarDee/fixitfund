import { getallprojectdetails } from '../../_lib/mongo/utils/getallprojectdetails';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const result = await getallprojectdetails();
        console.log(result)
        return NextResponse.json({data: result}, {status: 200});
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}