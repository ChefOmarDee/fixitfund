"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+

const DonationForm = ({ params }) => {
	const [amount, setAmount] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const router = useRouter(); // Initialize router
	const [goalmet, setGoalMet] = useState("");

	const validateAmount = (amount) => {
		// Ensure amount is a positive number and has at most two decimal places
		const regex = /^\d+(\.\d{1,2})?$/;
		return regex.test(amount) && parseFloat(amount) > 0;
	};

	const handleDonation = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!validateAmount(amount)) {
			setError(
				"Please enter a valid donation amount (positive with up to two decimal places)."
			);
			return;
		}

		try {
			const response = await fetch("/api/updatedonate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					projectID: params.projectId,
					donationAmount: parseFloat(amount),
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to process donation");
			}
			if (data.data.goalm === true) {
				setGoalMet("THANK YOU, GOAL HAS BEEN MET!");
			}
			setSuccess(
				`Donation successful! Thank you for your contribution of $${data.data.donatedAmount.toFixed(
					2
				)}.`
			);
			setAmount("");

			// Navigate to the home page after successful donation
			setTimeout(() => {
				router.push("/"); // Redirect to the home page
			}, 2000); // Wait for 2 seconds before redirecting
		} catch (error) {
			console.error("Error processing donation:", error);
			setError(
				error.message ||
					"An error occurred while processing your donation. Please try again."
			);
		}
	};

	return (
		<div className="min-h-screen bg-[#FFFAF1] flex justify-center items-center">
			<div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-[#019ca0]">
					Make a Donation
				</h2>
				<form onSubmit={handleDonation} className="space-y-4">
					<div>
						<label
							htmlFor="amount"
							className="block text-sm font-medium text-black mb-1"
						>
							Donation Amount ($)
						</label>
						<input
							type="number"
							id="amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f17418] focus:border-transparent"
							placeholder="Enter amount"
							min="0.01"
							step="0.01"
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && (
						<p className="text-green-500 text-sm">
							{success}
							{goalmet}
						</p>
					)}
					<button
						type="submit"
						className="w-full py-2 px-4 bg-[#f17418] hover:bg-[#d95f00] text-white font-bold rounded-lg transition duration-200"
					>
						Donate Now
					</button>
				</form>
			</div>
		</div>
	);
};

export default DonationForm;
