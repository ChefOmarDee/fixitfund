"use client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your actual Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function ProjectDetails({ params }) {
	console.log(mapboxgl.accessToken); // should print your API key

	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [picUrl, setPicUrl] = useState("");
	const [status, setStatus] = useState("");
	const [tag, setTag] = useState("");
	const [cost, setCost] = useState(0);
	const [donated, setDonated] = useState(0);
	const [userClass, setUserClass] = useState("");
	const [userID, setUserID] = useState("");
	const [longitude, setLongitude] = useState(null);
	const [latitude, setLatitude] = useState(null);
	const projectId = params.projectID;
	const mapContainer = useRef(null);
	const map = useRef(null);

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log("loggedin");
				setUserID(user.uid);
			} else {
				setUserID("");
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const projectResponse = await fetch(
					`/api/getprojectdetails?projectID=${projectId}`
				);
				if (!projectResponse.ok) {
					throw new Error("Network response was not ok for project details");
				}
				let projectResult = await projectResponse.json();
				projectResult = projectResult.projectDetails;
				setData(JSON.stringify(projectResult));
				setTitle(projectResult.Title);
				setDesc(projectResult.Desc);
				setPicUrl(projectResult.PictureURL);
				setStatus(projectResult.Status);
				setTag(projectResult.Tag);
				setCost(parseFloat(projectResult.cost?.$numberDecimal || 0));
				setDonated(parseFloat(projectResult.Donated?.$numberDecimal || 0));
				setLongitude(projectResult.Long);
				setLatitude(projectResult.Lat);
				console.log(projectResult);

				if (userID) {
					const userResponse = await fetch(
						`/api/getuserclass?userID=${userID}`
					);
					if (!userResponse.ok) {
						throw new Error("Network response was not ok for user status");
					}
					const userResult = await userResponse.json();
					setUserClass(userResult.status || null);
					console.log("User class:", userResult.status);
				}
			} catch (error) {
				console.log(error);
				setError(error.message);
			}
		};

		fetchData();
	}, [projectId, userID]);

	useEffect(() => {
		if (longitude && latitude && !map.current) {
			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/streets-v11",
				center: [longitude, latitude],
				zoom: 12,
			});

			new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current);
		}
	}, [longitude, latitude]);

	const renderActionButton = () => {
		switch (status?.toLowerCase()) {
			case "open":
				if (userClass.toLowerCase() === "wor") {
					return (
						<Link href={`/claimproject/${projectId}`}>
							<button className="w-full py-2 px-4 bg-[#f17418] hover:bg-[#d95f00] text-white font-bold rounded-lg transition duration-200">
								Claim This Project
							</button>
						</Link>
					);
				} else {
					return <div className="text-[#f17418]">Waiting to be claimed...</div>;
				}
			case "in progress":
				return (
					<Link href={`/donate/${projectId}`} passHref>
						<button className="w-full py-2 px-4 bg-[#f17418] hover:bg-[#d95f00] text-white font-bold rounded-lg transition duration-200">
							Donate Now
						</button>
					</Link>
				);
			case "closed":
				return null;
			default:
				return null;
		}
	};

	const renderProgressBar = () => {
		if (status?.toLowerCase() !== "open") {
			const progress = (donated / cost) * 100;
			return (
				<>
					<div className="relative pt-1">
						<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
							<div
								style={{ width: `${progress}%` }}
								className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
							></div>
						</div>
					</div>
					<div className="text-sm text-[#A9A9A9]">
						<span className="text-lg font-bold text-[#f17418]">${donated}</span>{" "}
						raised of ${cost} goal
					</div>
				</>
			);
		}
		return null;
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-[#FFFAF1]">
			<div className="flex flex-col items-center max-w-2xl mx-auto p-4">
				<h1 className="text-3xl font-bold mb-4 text-[#019ca0]">{title}</h1>

				<img
					src={picUrl}
					alt="Campaign Image"
					className="w-full mb-6 rounded-lg h-96 object-cover"
				/>

				<div className="w-full bg-white shadow-md rounded-lg overflow-hidden mb-6">
					<div className="p-6">
						<div className="space-y-4">
							{renderProgressBar()}
							<div className="py-2 flex items-center space-x-2">
								<span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-600 cursor-pointer">
									<svg
										className="w-4 h-4 mr-1"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
									</svg>
									{tag}
								</span>
								<span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-600 cursor-pointer">
									<svg
										className="w-4 h-4 mr-1"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
									</svg>
									{status}
								</span>
							</div>
							<div className="text-sm text-gray-600">{desc}</div>
						</div>

						<div className="mt-6 space-y-3">{renderActionButton()}</div>
					</div>
				</div>

				<div ref={mapContainer} className="w-full h-64 rounded-lg mb-6" />
			</div>
		</div>
	);
}
