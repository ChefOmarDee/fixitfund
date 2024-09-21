"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, FileText, Type } from "lucide-react";
import { auth } from '../../../_lib/firebase.ts';
import { onAuthStateChanged } from "firebase/auth"; // Listen for changes in auth state

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Fetch the user data from Firebase once the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        setMessage("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch the user data from the API
  const fetchUserData = async (uid) => {
    try {
      const response = await fetch(`/api/user/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        console.log(data)
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while fetching user data.");
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100">
      <header className="bg-lightblue text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Account Information</h1>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <div className="bg-white shadow-lg rounded-lg max-w-2xl mx-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <Type className="inline-block w-5 h-5 mr-2" />
                First Name
              </label>
              <p className="p-3 border border-gray-300 rounded-md">
                {userData.firstName}
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <Type className="inline-block w-5 h-5 mr-2" />
                Last Name
              </label>
              <p className="p-3 border border-gray-300 rounded-md">
                {userData.lastName}
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <FileText className="inline-block w-5 h-5 mr-2" />
                Email
              </label>
              <p className="p-3 border border-gray-300 rounded-md">
                {userData.email}
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                <FileText className="inline-block w-5 h-5 mr-2" />
                UID
              </label>
              <p className="p-3 border border-gray-300 rounded-md">
                {userData.uid}
              </p>
            </div>
            <div>
                <label className="block mb-2 font-medium text-gray-700">
                    <FileText className="inline-block w-5 h-5 mr-2" />
                    Classification
                </label>
                <p className="p-3 border border-gray-300 rounded-md">
                    {getUserClassification(userData.class)}
                </p>
            </div>


            {/* Other fields */}
          </div>

          {message && (
            <div
              className={`mt-4 p-4 ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } border border-${message.includes("successfully") ? "green" : "red"}-300 rounded-md`}
            >
              <h3 className="text-lg font-semibold">
                {message.includes("successfully") ? "Status" : "Error"}
              </h3>
              <p>{message}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
const getUserClassification = (classification) => {
    switch (classification) {
      case "civ":
        return "Civilian";
      case "wor":
        return "Worker";
      case "und":
      default:
        return "Undefined";
    }
  };
export default Account;
