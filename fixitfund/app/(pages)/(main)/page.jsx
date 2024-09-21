"use client"
import { useEffect, useState } from 'react';

export default function Home() {
  const testingData = [
    {
      Location: 'Florida',
      Title: "Omars house",
      Description: "Omars house",
      ProjectId: "1",
      UId: "01",
      Cost: "10000",
      Donated: "100",
      Status: "Open",
      PictureUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fcute-cat&psig=AOvVaw0AsRKsCeA-rRrEhI4lcCpR&ust=1726985991950000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjrk6ay04gDFQAAAAAdAAAAABAE",
      Tags: "Schlawg Clone FRFR"
    }
  ]
  let [projectArray, setProjects] = useState([]);
  let [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/getProjects", {
        method: "GET",
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

  return (
    <div className="bg-[#FFFAF1] text-black h-[100%] w-[100%] absolute mt-[10vh] top-0">
      <div className={"flex bg-[url('../homeBg.jpg')] bg-cover bg-no-repeat justify-center items-center flex-col h-[50vh]"}>
        <h1 className={'text-white text-[60px] font-bold'}>Fix-It-Fund</h1> 
        <h3 className ={'text-white text-[20px] font-medium'} >Your one stop shop for improving your community</h3>
      </div>
      <div className={'min-h-[50vh] max-h-[100%] flex-grow overflow-y-auto'}>
        <h1 className='text-center font-bold text-[40px]'>Home</h1>

      </div>
    </div>
  );
}
