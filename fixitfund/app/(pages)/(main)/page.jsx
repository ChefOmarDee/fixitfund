"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@ramonak/react-progress-bar';

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
      PictureUrl: "https://as2.ftcdn.net/v2/jpg/02/66/72/41/1000_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
      Tags: "Schlawg Clone FRFR"
    } 
  ]
  let [projectArray, setProjects] = useState([]);
  let [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const redirectToProject = (projectId) => {
    router.push(`/project/${projectId}`);
  }
  
  useEffect(() => {
    //fetchProjects();
  }, [fetchProjects])

  return (
    <div className="bg-[#FFFAF1] text-black h-[100%] w-[100%] absolute mt-[10vh] top-0">
      <div className={"flex bg-[url('../homeBg.jpg')] bg-cover bg-no-repeat justify-center items-center flex-col h-[50vh]"}>
        <h1 className={'text-white text-[60px] font-bold'}>Fix-It-Fund</h1> 
        <h3 className ={'text-white text-[20px] font-medium'} >Your one stop shop for improving your community</h3>
      </div>
      <div className = {'bg-[#FFFAF1] '}>
        <h1 className='text-center font-bold text-[40px]'>Home</h1>
      </div>
      {loading &&
        <div className={'h-[100%] w-[100%] text-[100px] bg-[#FFFAF1] flex text-center justify-center align-center'}>
          <h1 className="mt-[10vh] font-bold">loading...</h1>
        </div>
      }
      {!loading &&
      <div className={'min-h-[100%] bg-[#FFFAF1] hover:cursor-pointer max-md:grid-cols-1 grid grid-cols-3 overflow-y-auto'}>
          {projectArray.length !== 0 &&  projectArray.map((project) => (
          <div key={project.ProjectId} onClick={() => redirectToProject(project.ProjectId)} className="w-[25vw] rounded-xl mx-auto h-[40vh] hover:bg-gray-300 transition-colors duration-300 max-md:w-[85vw] max-md:h-[45vh] mt-[2vh] overflow-hidden bg-gray-200">
            <img 
              src={project.PictureUrl} 
              alt={project.Title} 
              className="w-full h-[75%] object-cover" 
            />
            <h3 className="text-black font-bold text-xl ml-[10px]">{project.Title}</h3>
            <h4 className="font-medium text-black text-md ml-[10px]">{project.Description}</h4>
            <ProgressBar bgColor='green' width={'90%'} margin='0 0 0 10px' completed={(parseInt(project.Donated)/parseInt(project.Cost)) * 100} customLabelStyles={{ paddingLeft: '10px'}}/>
            <h4 className="text-sm text-black font-light ml-[10px]">Amount Donated: {(parseInt(project.Donated)/parseInt(project.Cost)) * 100}%</h4>
          </div>
        ))}
      </div>
    }
    </div>
  );
}
