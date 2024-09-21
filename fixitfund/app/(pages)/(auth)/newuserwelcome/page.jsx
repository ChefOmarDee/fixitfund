"use client";
import React, { useState, useEffect } from 'react';
import { LogIn, CircleUser, UserPen} from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

const NewUserWelcome = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountType, setType] = useState('');
    const router = useRouter;
    const [token, setToken] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedToken = localStorage.getItem("Token");
            setToken(savedToken);
        }
    }, []);

    const handleSelectChange = (e) => {
        setType(e.target.value);
        console.log(accountType)
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(name.trim() === "" || accountType.trim() === ""){
            setName("");    
            setType("");
            return toast.error("Please do not leave inputs blank !", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        try {
            const data = {
                Class: accountType,
                FName: firstName,
                LName: lastName
            }
            const response = await fetch("/postUserInformation", {
              method: "Post",
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            
              router.push("/");
          } catch (error) {
            console.error('Error in post request:', error);
          } 
    }

  return (
    <div className="min-h-screen bg-[#FFFAF1] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Please Select To Continue</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block mb-2 font-medium text-gray-700">
              <CircleUser className="inline-block w-5 h-5 mr-2" />
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-2 font-medium text-gray-700">
              <CircleUser className="inline-block w-5 h-5 mr-2" />
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              <UserPen className="inline-block w-5 h-5 mr-2" />
              Account Type
            </label>
            <select
              id="accountType"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Select Account Type"
              value={accountType}
              onChange={(e) => handleSelectChange(e)}
            >
                <option value="Civilian">Civilian</option>
                <option value="Contractor">Contractor</option>
                <option value="Undecided">Undecided</option>
            </select>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-lightblue text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            <LogIn className="inline-block w-5 h-5 mr-2" />
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUserWelcome;