"use client"
import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, MapPin, Tag, User } from 'lucide-react';

const ClaimProject = ({ params }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [projectDetails, setProjectDetails] = useState(null); // New state for project details
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch project details when the component mounts
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`/api/getallprojectdetails?projectID=${params.projectID}`);
        const data = await response.json();

        if (response.ok) {
          setProjectDetails(data); // Set the fetched project details
        } else {
          throw new Error(data.error || 'Failed to fetch project details');
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchProjectDetails();
  }, [params.projectID]); // Fetch when projectID changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/claimproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: params.projectID,
          donationAmount: parseFloat(donationAmount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Project claimed successfully!');
        console.log('Donation amount needed:', donationAmount, 'Project ID:', params.projectID);
      } else {
        throw new Error(data.error || 'Failed to claim project');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF1] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Claim Project</h1>
        
        {projectDetails ? (
          <div className="mb-6 p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-orange-500">Project Details</h2>
            <p className="flex items-center mb-2">
              <FileText className="inline-block w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium">Title:</span> {projectDetails.Title || 'No title'}
            </p>
            <p className="flex items-center mb-2">
              <MapPin className="inline-block w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium">Latitude:</span> {projectDetails.Lat || 'No location'}
            </p>
            <p className="flex items-center mb-2">
              <MapPin className="inline-block w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium">Longitude:</span> {projectDetails.Long || 'No location'}
            </p>
            <p className="flex items-center mb-2">
              <Tag className="inline-block w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium">Tag:</span> {projectDetails.Tag || 'No tag'}
            </p>
            <p className="flex items-center">
              <User className="inline-block w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium">Created by:</span> {projectDetails.UID || 'Unknown'}
            </p>
          </div>
        ) : (
          <p>Loading project details...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="donationAmount" className="block mb-2 font-medium text-gray-700">
              <DollarSign className="inline-block w-5 h-5 mr-2 text-orange-500" />
              Donation Amount Needed
            </label>
            <input
              id="donationAmount"
              type="number"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter donation amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#019ca0] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-[#49bfc3] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Claim Project'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border rounded-md`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            By claiming this project, you agree to our{' '}
            <a href="#" className="text-orange-500 hover:underline">
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimProject;
