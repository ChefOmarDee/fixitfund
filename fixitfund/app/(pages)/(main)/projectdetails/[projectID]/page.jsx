"use client";
import { useEffect, useState } from "react";

export default function ProjectDetails({params}){
    const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [picUrl, setPicUrl] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const [cost,setCost] = useState(0);
  const [donated,setDonated] = useState(0);
  const [userClass, setUserClass] = useState("");
  const [userID, setUserID] = useState("");
    const projectId = params.projectID;
    useEffect(() => {
        const fetchData = async () => {
          try {
            // First, fetch project details
            const projectResponse = await fetch(`/api/getallprojectdetails?projectID=${projectId}`);
            if (!projectResponse.ok) {
              throw new Error('Network response was not ok for project details');
            }
            const projectResult = await projectResponse.json();
            console.log(projectResult);
            console.log(projectResult.UID);
            setData(JSON.stringify(projectResult));
            setTitle(projectResult.Title);
            setDesc(projectResult.Desc);
            setPicUrl(projectResult.PictureURL);
            setStatus(projectResult.Status);
            setTag(projectResult.Tag);
            setCost(projectResult.cost);
            setDonated(projectResult.Donated);
            setUserID(projectResult.UID);
      
        const userResponse = await fetch(`/api/getuserclass?userID=${projectResult.UID}`);
      if (!userResponse.ok) {
        throw new Error('Network response was not ok for user status');
      }
            // Then, fetch user class using the UID from project details
            const userResult = await  userResponse.json();
            if (userResult.status !== undefined) {
              setUserClass(userResult.status);
              console.log("User class:", userResult.status);
            } else {
              console.log("User class not found");
              setUserClass(null);
            }
      
      
          } catch (error) {
            console.log(error);
            setError(error.message);
          }
        };
      
        fetchData();
      }, [projectId]); // Add projectId as a dependency if it's not constant
  const renderActionButton = () => {
    switch(status.toLowerCase()) {
        case 'open':
            if (userClass.toLowerCase() === 'worker') {
                return (
                    <button className="w-full py-2 px-4 bg-[#f17418] hover:bg-[#d95f00] text-white font-bold rounded-lg transition duration-200">
                        Claim This Project
                    </button>
                );
            }
            else {
                return (
                    <div className="text-[#f17418]">Waiting to be claimed...</div>
                );
            }
        case 'in progress':
            return (
                <Link href={`/donate/${projectId}`} passHref>
                <button className="w-full py-2 px-4 bg-[#f17418] hover:bg-[#d95f00] text-white font-bold rounded-lg transition duration-200">
                    Donate Now
                </button>
                </Link>
            );
        case 'closed':
            return null;
        default:
            return null;
    }
};

const renderProgressBar = () => {
    if (status.toLowerCase() === 'in progress') {
        const progress = (donated / cost) * 100;
        return (
            <>
                <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                    </div>
                </div>
                <div className="text-sm text-[#A9A9A9]">
                    <span className="text-lg font-bold text-[#f17418]">${donated}</span> raised of ${cost} goal
                </div>
            </>
        );
    }
    return null;
};

return (
    <div className="min-h-screen bg-[#FFFAF1]"> 
        <div className="flex flex-col items-center max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-[#019ca0]">{title}</h1>
            
            <img 
                src={picUrl}
                alt="Campaign Image" 
                className="w-full h-auto mb-6 rounded-lg"
            />
            
            <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="space-y-4">
                        {renderProgressBar()}
                        <div className="py-2 flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-600 cursor-pointer">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                {tag}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-600 cursor-pointer">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                {status}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">{desc}</div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                        {renderActionButton()}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}