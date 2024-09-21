"use client"
import { useEffect, useId, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { onAuthStateChanged } from 'firebase/auth';
import ProgressBar from '@ramonak/react-progress-bar';
import { auth } from '../../_lib/firebase';
const Select = dynamic(() => import('react-select'), { ssr: false });
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function Home() {
  const testingData = [
    {
      Location: 'Florida',
      Title: "Omars house",
      Description: "Omars house",
      ProjectId: "1",
      UId: "01",
      Class: "Repair",
      Cost: "10000",
      Donated: "100",
      Status: "Open",
      PictureUrl: "https://as2.ftcdn.net/v2/jpg/02/66/72/41/1000_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
      Tags: "Schlawg Clone FRFR"
    } 
  ]
  let [projectArray, setProjects] = useState([]);
  let [loading, setLoading] = useState(true);
  let [statusInput, setStatus] = useState('');
  const router = useRouter();
  const hasMounted = useRef(false);
  const [isNotLoggedIn, setNotLoggedIn] = useState();
  const token =  typeof window !== "undefined" ? localStorage.getItem("Token") : null;

  const statusOptions = [
    { value: 'open', label: 'Open'},
    { value: 'in progress', label: 'In Progress'},
    { value: 'closed', label: 'Closed'},
    { value: 'Any', label: 'Any'}
  ]

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.293133);
  const [lat, setLat] = useState(26.2023023);
  const [zoom, setZoom] = useState(8);

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

    if(statusInput === ""){
      return;
    }
    try {
      const response = await fetch(`/api/filterprojects/${statusInput}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      console.log(data)
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
    if (hasMounted.current) {
      fetchProjectsWithQuery();
    } else {
      hasMounted.current = true;
    }
  }, [statusInput]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser){
        setNotLoggedIn(true);
      }
      else{
        setNotLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isNotLoggedIn){
      CheckUser();
    }
  }, [isNotLoggedIn])

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

    // Wait for the map to load before adding markers
    map.current.on('load', () => {
      addMarkersToMap();
    });
  }, []); // Empty dependency array, this effect runs once on mount

  useEffect(() => {
    if (map.current && map.current.loaded()) {
      addMarkersToMap();
    }
  }, [projectArray]); // This effect runs when projectArray changes

  const addMarkersToMap = () => {
    // Remove existing markers
    if (map.current.getLayer('markers')) {
      map.current.removeLayer('markers');
    }
    if (map.current.getSource('markers')) {
      map.current.removeSource('markers');
    }

    // Add new markers
    const features = projectArray
      .filter(project => project.long && project.lat && 
               !isNaN(parseFloat(project.long)) && !isNaN(parseFloat(project.lat)))
      .map(project => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(project.long), parseFloat(project.lat)]
        },
        properties: {
          title: project.Title,
          description: project.Description
        }
      }));

    if (features.length > 0) {
      map.current.addSource('markers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        }
      });

      map.current.addLayer({
        id: 'markers',
        type: 'circle',
        source: 'markers',
        paint: {
          'circle-radius': 15,
          'circle-color': '#B42222'
        }
      });

      // Add popups
      // map.current.on('click', 'markers', (e) => {
      //   const coordinates = e.features[0].geometry.coordinates.slice();
      //   const { title, description } = e.features[0].properties;

      //   new mapboxgl.Popup()
      //     .setLngLat(coordinates)
      //     .setHTML(`<h3>${title}</h3><p>${description}</p>`)
      //     .addTo(map.current);
      // });

      // Change cursor to pointer when hovering over a marker
      map.current.on('mouseenter', 'markers', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'markers', () => {
        map.current.getCanvas().style.cursor = '';
      });
    }
  };

  return (
    <div className="bg-[#FFFAF1] overflow-x-hidden text-black h-[100%] pb-[20px] w-[100%] absolute mt-[10vh] top-0">
      <div className={"flex bg-[url('../homeBg.jpg')] bg-cover bg-no-repeat justify-center items-center flex-col h-[50vh]"}>
        <h1 className={'text-white text-[60px] font-bold'}>Fix-It-Fund</h1> 
        <h3 className ={'text-white text-[20px] font-medium max-md:text-[16px] max-md:text-center'} >Your one stop shop for improving your community</h3>
      </div>
      <div className="w-full bg-[#94DBFF] py-8">
        <div ref={mapContainer} className="map-container mx-auto rounded-lg shadow-lg" style={{ height: '500px', width: '80%', maxWidth: '1200px' }} />
      </div>
      <div className = {'bg-[#FFFAF1] flex flex-row items-center py-4 justify-evenly'}>
        <Select
        closeMenuOnSelect={false}
        options={statusOptions}
        instanceId={useId()}
        onChange={(e) => setStatus(e.value)}
        className={'w-[15vw] max-md:w-[25vw]'}
        placeholder="Status Filter"
        />
        <h1 className='text-center font-bold text-[40px]'>Home</h1>
      </div>
      {loading &&
        <div className={'h-[100%] w-[100%] text-[100px] overflow-x-hidden max-md:text-[50px] bg-[#FFFAF1] flex text-center justify-center align-center'}>
          <h1 className="mt-[10vh] font-bold">loading...</h1>
        </div>
      }
      {!loading &&
      <div className={'min-h-[100%] bg-[#FFFAF1] hover:cursor-pointer max-md:grid-cols-1 grid grid-cols-3 overflow-y-auto'}>
          {projectArray.length !== 0 &&  projectArray.map((project) => (
          <div key={project.ProjectId} onClick={() => redirectToProject(project.ProjectId)} className="w-[25vw] rounded-xl mx-auto h-[40vh] hover:bg-gray-300 transition-colors duration-300 max-md:w-[85vw] max-md:h-[45vh] mt-[2vh] overflow-hidden bg-gray-200">
            <img 
              src={project.pictureUrl} 
              alt={project.Title} 
              className="w-full h-[75%] object-cover" 
            />
            <h3 className="text-black font-bold text-xl ml-[10px]">{project.Title}</h3>
            <h4 className="font-medium text-black text-md ml-[10px]">{project.Description}</h4>
            <ProgressBar bgColor='green' width={'90%'} margin='0 0 0 10px' completed={Number(project.donated) === 0 || Number(project.cost) === 0 ? 0 : (Number(project.donated)/Number(project.cost)) * 100} customLabelStyles={{ paddingLeft: '10px'}}/>
            <h4 className="text-sm text-black font-light ml-[10px]">Amount Donated: {Number(project.donated) === 0 || Number(project.cost) === 0 ? 0 :(Number(project.donated)/Number(project.cost)) * 100}%</h4>
          </div>
        ))}
      </div>
    }
    </div>
  );
}