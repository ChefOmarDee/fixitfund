"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Tag, FileText, Type } from 'lucide-react';
import { auth } from '../../../_lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [tag, setTag] = useState('environmental');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [userUID, setUserUID] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserUID(currentUser.uid);
      } else {
        setMessage("No user logged in");
        router.push('/login'); // Redirect to login page if no user is logged in
      }
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, (error) => {
        console.error('Error getting location:', error);
      });
    }

    return () => unsubscribe();
  }, [router]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userUID) {
      setMessage("Please log in to upload a project");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);
    if (location) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }
    formData.append('tag', tag);
    formData.append('uid', userUID); // Include the UID

    try {
      const response = await fetch('/api/projectcreation', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Project uploaded successfully!');
        router.push('/');
      } else {
        throw new Error(data.error || 'Failed to upload project');
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
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Upload Project</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
              <FileText className="inline-block w-5 h-5 mr-2 text-orange-500" />
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
              <Type className="inline-block w-5 h-5 mr-2 text-orange-500" />
              Description
            </label>
            <textarea
              id="description"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 font-medium text-gray-700">
              <Camera className="inline-block w-5 h-5 mr-2 text-orange-500" />
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tag" className="block mb-2 font-medium text-gray-700">
              <Tag className="inline-block w-5 h-5 mr-2 text-orange-500" />
              Tag
            </label>
            <select
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="environmental">Environmental</option>
              <option value="infrastructure damage">infrastructure damage</option>
              <option value="infrastructure addition">infrastructure addition</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-md text-lg font-semibold transition duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#019ca0] text-white hover:bg-[#49bfc3]'}`}
          >
            {isLoading ? 'Uploading...' : 'Upload Project'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border rounded-md`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
