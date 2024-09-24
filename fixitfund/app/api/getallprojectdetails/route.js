import { getallprojectdetails } from "../../_lib/mongo/utils/getallprojectdetails";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
	try {
		const result = await getallprojectdetails();

		const response = NextResponse.json({ data: result }, { status: 200 });

		response.headers.set("Cache-Control", "no-store, max-age=0");
		response.headers.set("Pragma", "no-cache");
		response.headers.set("Expires", "0");

		return response;
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
