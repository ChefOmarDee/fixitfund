
import { NextResponse } from 'next/server';
 
export async function GET(req, res) {
    const url = new URL(req.url);
    const projectID = url.searchParams.get('projectID');
    console.log("hello");
    console.log(projectID);
    const projectDetails = {
        Location: {
          longitude: -80.12345,
          latitude: 26.12345
        },
        Title: "Community Park Revitalization",
        Desc: "A project to enhance the local park facilities and green spaces.",
        ProjectID: "proj-12345",
        UID: "user-67890",
        WID: "work-54321",
        cost: {
          estimated: 5000.00,
          actual: 4500.00
        },
        Donated: 2000.00,
        Status: "in progress",
        PictureURL: "https://example.com/images/park.jpg",
        Tag: "environmental"
      };
      
      
    return NextResponse.json(projectDetails)
}
