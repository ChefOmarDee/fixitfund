"use client";
import React, { useState, useEffect } from "react";

export default function ProjectDetails({params}){
    const [data, setData] = useState(null);
  const [error, setError] = useState(null);
    const projectId = params.projectID;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getallprojectdetails?projectID=${projectId}`); // Adjust your API route
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(JSON.stringify(result));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);
    return (
        <>
        <h1>{data}</h1>
        </>
    )
}