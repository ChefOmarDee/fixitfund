import { updatedonated } from "../../_lib/mongo/utils/updatedonate";
import { NextResponse } from "next/server";

export async function POST(req, res) {
	const body = await req.json();
	const { projectID, donationAmount } = body;

	// Validate donationAmount is a positive number with up to 2 decimal places
	const isValidAmount = (amount) => {
		return (
			/^\d+(\.\d{1,2})?$/.test(amount.toString()) && parseFloat(amount) > 0
		);
	};

	if (!isValidAmount(donationAmount)) {
		return NextResponse.json(
			{ error: "Invalid donation amount" },
			{ status: 400 }
		);
	}

	const msg = await updatedonated(projectID, parseFloat(donationAmount));
	return NextResponse.json(msg);
}
