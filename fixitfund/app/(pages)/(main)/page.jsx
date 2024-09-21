"use client"
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { onAuthStateChanged } from 'firebase/auth';
import ProgressBar from '@ramonak/react-progress-bar';
import { auth } from '../../_lib/firebase';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function Home() {
  const [projectArray, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;
  const isNotLoggedIn = user === null;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.1002);
  const [lat, setLat] = useState(26.3746);
  const [zoom, setZoom] = useState(6);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getallprojectdetails", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      console.log(data.data)
      setProjects(data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsWithQuery = async() => {
    setLoading(true);
    try {
      const response = await fetch(`/api/filterprojects/:Status=${statusInput}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setProjects(data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  const CheckUser = async () => {
    try {
      const userId = auth.currentUser.uid;
      const response = await fetch(`/api/getuserclass?userID=${userId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if(data.status === undefined){
        router.push("/newuserwelcome");
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  const redirectToProject = (projectId) => {
    router.push(`/project/${projectId}`);
  }
  
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!isNotLoggedIn){
      CheckUser();
    }
  }, [isNotLoggedIn]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create markers for each project
    projectArray.forEach((project) => {
      if (project.Longitude && project.Latitude) {
        new mapboxgl.Marker()
          .setLngLat([project.Longitude, project.Latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${project.Title}</h3><p>${project.Description}</p>`))
          .addTo(map.current);
      }
    });
  }, [projectArray, lng, lat, zoom]);

  return (
    <div className="bg-[#FFFAF1] overflow-x-hidden text-black h-[100%] w-[100%] absolute mt-[10vh] top-0">
      <div className={"flex bg-[url('../homeBg.jpg')] bg-cover bg-no-repeat justify-center items-center flex-col h-[50vh]"}>
        <h1 className={'text-white text-[60px] font-bold'}>Fix-It-Fund</h1> 
        <h3 className ={'text-white text-[20px] font-medium'}>Your one stop shop for improving your community</h3>
      </div>
      <div className={'bg-[#FFFAF1]'}>
        <h1 className='text-center font-bold text-[40px]'>Home</h1>
      </div>
      {loading &&
        <div className={'h-[100%] w-[100%] text-[100px] overflow-x-hidden max-md:text-[50px] bg-[#FFFAF1] flex text-center justify-center align-center'}>
          <h1 className="mt-[10vh] font-bold">loading...</h1>
        </div>
      }
      {!loading &&
        <div className={'min-h-[100%] bg-[#FFFAF1] hover:cursor-pointer max-md:grid-cols-1 grid grid-cols-1 overflow-y-auto'}>
          <div className="w-full bg-[#94DBFF] py-8">
            <div ref={mapContainer} className="map-container mx-auto rounded-lg shadow-lg" style={{ height: '400px', width: '80%', maxWidth: '1200px' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {projectArray.length !== 0 && projectArray.map((project) => (
              <div key={project.ProjectId} onClick={() => redirectToProject(project.ProjectId)} className="rounded-xl hover:bg-gray-300 transition-colors duration-300 overflow-hidden bg-gray-200">
                <img 
                  src={project.PictureUrl} 
                  alt={project.Title} 
                  className="w-full h-[200px] object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-black font-bold text-xl">{project.Title}</h3>
                  <h4 className="font-medium text-black text-md mt-2">{project.Description}</h4>
                  <ProgressBar bgColor='green' width={'100%'} completed={(parseInt(project.Donated)/parseInt(project.Cost)) * 100} customLabelStyles={{ paddingLeft: '10px'}}/>
                  <h4 className="text-sm text-black font-light mt-2">Amount Donated: {(parseInt(project.Donated)/parseInt(project.Cost)) * 100}%</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
}