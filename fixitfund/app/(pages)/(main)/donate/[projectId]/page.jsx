"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // For Next.js 13+

const DonationForm = ({ params }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();  // Initialize router

  const handleDonation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }

    try {
      const response = await fetch('/api/updatedonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectID: params.projectId,
          donationAmount: amount
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process donation');
      }

      setSuccess('Donation successful! Thank you for your contribution.');
      setAmount('');

      // Navigate to the home page after successful donation
      setTimeout(() => {
        router.push('/');  // Redirect to the home page
      }, 2000);  // Wait for 2 seconds before redirecting
      
    } catch (error) {
      console.error('Error processing donation:', error);
      setError(error.message || 'An error occurred while processing your donation. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF1] flex justify-center items-center">
      <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#019ca0]">Make a Donation</h2>
        <form onSubmit={handleDonation} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-black mb-1">
              Donation Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f17418] focus:border-transparent"
              placeholder="Enter amount"
              min="1"
              step="1"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
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
