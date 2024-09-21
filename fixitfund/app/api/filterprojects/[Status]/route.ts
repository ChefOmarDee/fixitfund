import { NextResponse } from 'next/server'
import { filterProject } from '../../../_lib/mongo/utils/filterproject';
 
export async function GET(request: Request, { params }: { params: { Status: string}}) {
  try{
  const status = params.Status;
  const results = await filterProject(status);

   return NextResponse.json({data: results}, {status: 200});
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}