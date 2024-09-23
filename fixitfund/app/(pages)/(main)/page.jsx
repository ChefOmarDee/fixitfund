"use client";
import React, { useEffect, useId, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../_lib/firebase";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Select = dynamic(() => import("react-select"), { ssr: false });

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function Home() {
	const [projectArray, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [statusInput, setStatus] = useState("");
	const router = useRouter();
	const [isNotLoggedIn, setNotLoggedIn] = useState(false);
	const token =
		typeof window !== "undefined" ? localStorage.getItem("Token") : null;
	const mapContainer = useRef(null);
	const map = useRef(null);

	const statusOptions = [
		{ value: "open", label: "Open" },
		{ value: "in progress", label: "In Progress" },
		{ value: "closed", label: "Closed" },
		{ value: "Any", label: "Any" },
	];

	const fetchProjects = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/getallprojectdetails", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setProjects(data.data);
		} catch (error) {
			console.error("Error fetching projects:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchProjectsWithQuery = async (status) => {
		setLoading(true);
		try {
			let url = "/api/getallprojectdetails";
			if (status && status !== "Any") {
				url = `/api/filterprojects/${status}`;
			}
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setProjects(data.data);
		} catch (error) {
			console.error("Error fetching projects:", error);
		} finally {
			setLoading(false);
		}
	};

	const CheckUser = async () => {
		try {
			const userId = auth.currentUser?.uid;
			if (!userId) return;
			const response = await fetch(`/api/getuserclass?userID=${userId}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			if (data.status === null) {
				router.push("/newuserwelcome");
			}
		} catch (error) {
			console.error("Error checking user:", error);
		}
	};

	const redirectToProject = (projectId) => {
		router.push(`/projectdetails/${projectId}`);
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	useEffect(() => {
		fetchProjectsWithQuery(statusInput);
	}, [statusInput]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setNotLoggedIn(!currentUser);
			if (currentUser) {
				CheckUser();
			}
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (projectArray.length > 0 && !map.current) {
			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/streets-v11",
				center: [projectArray[0].long, projectArray[0].lat],
				zoom: 10,
			});

			projectArray.forEach((project) => {
				const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
					`<strong>${project.title}</strong><br>${project.desc}`
				);

				new mapboxgl.Marker()
					.setLngLat([project.long, project.lat])
					.setPopup(popup)
					.addTo(map.current);
			});
		}
	}, [projectArray]);

	return (
		<div className="bg-[#FFFAF1] overflow-x-hidden text-black min-h-screen w-full">
			<div className="flex bg-[url('../homeBg.jpg')] bg-cover bg-no-repeat justify-center items-center flex-col h-[50vh]">
				<h1 className="text-white text-4xl md:text-6xl font-bold">
					Fix-It-Fund
				</h1>
				<h3 className="text-white text-base md:text-xl font-medium text-center px-4">
					Your one stop shop for improving your community
				</h3>
			</div>

			<div ref={mapContainer} className="w-full h-[300px] md:h-[400px] mb-6" />

			<div className="bg-[#FFFAF1] flex flex-row items-center py-4 md:py-10 justify-center">
				<Select
					closeMenuOnSelect={false}
					options={statusOptions}
					instanceId={useId()}
					onChange={(e) => setStatus(e.value)}
					className="w-[75vw] md:w-[25vw]"
					placeholder="Status Filter"
				/>
			</div>
			{loading && (
				<div className="h-full w-full text-4xl md:text-6xl overflow-x-hidden bg-[#FFFAF1] flex text-center justify-center items-center">
					<h1 className="mt-[10vh] font-bold">Loading...</h1>
				</div>
			)}
			{!loading && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 pb-8">
					{projectArray.length !== 0 &&
						projectArray.map((project) => {
							const percentage =
								(Number(project.donated) / Number(project.cost)) * 100;

							return (
								<div
									key={project.projectId}
									onClick={() => redirectToProject(project.projectId)}
									className="rounded-xl hover:bg-gray-300 transition-colors duration-300 overflow-hidden bg-gray-200 shadow-md"
								>
									<img
										src={project.pictureUrl}
										alt={project.title}
										className="w-full h-48 object-cover"
									/>
									<div className="p-4">
										<h3 className="text-black font-bold text-xl mb-2">
											{project.title}
										</h3>
										<p className="font-medium text-black text-sm mb-4 line-clamp-2">
											{project.desc}
										</p>

										{project.status === "open" ? (
											<p className="text-center text-sm font-medium text-yellow-600">
												Waiting To Be Claimed
											</p>
										) : (
											<div className="mb-2">
												<div className="flex justify-between text-sm text-gray-600 mb-1">
													<span>
														Raised: ${Number(project.donated).toLocaleString()}
													</span>
													<span>
														Goal: ${Number(project.cost).toLocaleString()}
													</span>
												</div>
												<div className="w-full bg-gray-300 rounded-full h-2.5">
													<div
														className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
														style={{ width: `${Math.min(percentage, 100)}%` }}
													></div>
												</div>
											</div>
										)}

										{project.status !== "open" && (
											<p className="text-sm text-gray-600 font-medium">
												{percentage.toFixed(1)}% funded
											</p>
										)}
									</div>
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
}
