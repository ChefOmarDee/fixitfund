"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Tag, FileText, Type } from 'lucide-react';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [tag, setTag] = useState('environmental');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    try {
      const response = await fetch('/api/projectcreation', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Project uploaded successfully!');
        setTimeout(() => router.push('/'), 2000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while uploading.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-100">
      <header className="bg-lightblue text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Project Upload</h1>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <div className="bg-white shadow-lg rounded-lg max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
                <Type className="inline-block w-5 h-5 mr-2" />
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                <FileText className="inline-block w-5 h-5 mr-2" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 font-medium text-gray-700">
                <Camera className="inline-block w-5 h-5 mr-2" />
                Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <label htmlFor="tag" className="block mb-2 font-medium text-gray-700">
                <Tag className="inline-block w-5 h-5 mr-2" />
                Tag
              </label>
              <select
                id="tag"
                name="tag"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="environmental">Environmental</option>
                <option value="infrastructure damage">Infrastructure Damage</option>
                <option value="infrastructure addition">Infrastructure Addition</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lightblue text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition duration-300"
            >
              {isLoading ? 'Uploading...' : 'Upload Project'}
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-4 ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border border-${message.includes('successfully') ? 'green' : 'red'}-300 rounded-md`}>
              <h3 className="text-lg font-semibold">{message.includes('successfully') ? 'Upload Status' : 'Error'}</h3>
              <p>{message}</p>
            </div>
          )}
          {location && (
            <div className="mt-4 p-4 bg-blue-100 text-blue-800 border border-blue-300 rounded-md">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="inline-block w-5 h-5 mr-2" />
                Location Detected
              </h3>
              <p>
                Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadForm;