"use client"
import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, MapPin, Tag, User } from 'lucide-react';
import { auth } from '../../../../_lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ClaimProject = ({ params }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userUID, setUserUID] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`/api/getprojectdetails?projectID=${params.projectID}`);
        const data = await response.json();

        if (response.ok) {
          setProjectDetails(data.projectDetails);
        } else {
          throw new Error(data.error || 'Failed to fetch project details');
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchProjectDetails();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserUID(currentUser.uid);
      } else {
        setMessage("No user logged in");
      }
    });

    return () => unsubscribe();
  }, [params.projectID]);

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
          userUID,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Project claimed successfully!');
        console.log('Donation amount:', donationAmount, 'Project ID:', params.projectID);
      } else {
        throw new Error(data.error || 'Failed to claim project');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isProjectClaimable = projectDetails && projectDetails.Status === 'open';

  return (
    <div className="min-h-screen bg-[#FFFAF1] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Claim Project</h1>
        
        {projectDetails ? (
          <div className="mb-6 p-4 bg-gray-100 rounded-md">
            <img 
              src={projectDetails.PictureURL} 
              alt={projectDetails.Title} 
              className="w-full h-auto rounded-md mb-4" 
            />
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
            
            

            {projectDetails.Status !== 'open' && (
              <p className="text-red-500 font-medium mt-2">
                This project has already been taken or is not available for claiming.
              </p>
            )}
          </div>
        ) : (
          <p>Loading project details...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="donationAmount" className="block mb-2 font-medium text-gray-700">
              <DollarSign className="inline-block w-5 h-5 mr-2 text-orange-500" />
              Donation Amount
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
            disabled={!isProjectClaimable || isLoading}
            className={`w-full ${
              isProjectClaimable
                ? 'bg-[#019ca0] text-white hover:bg-[#49bfc3]'
                : 'bg-gray-400 text-white cursor-not-allowed'
            } px-6 py-3 rounded-md text-lg font-semibold transition duration-300`}
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
