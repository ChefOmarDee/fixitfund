"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, FileText, Type } from "lucide-react";
import { auth } from "../../../_lib/firebase";
import { onAuthStateChanged } from "firebase/auth"; // Listen for changes in auth state

const Account = () => {
	const [userData, setUserData] = useState(null);
	const [projects, setProjects] = useState([]);
	const [message, setMessage] = useState("");
	const [filter, setFilter] = useState("created"); // Options: "created", "in-progress", "completed"
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

	// Fetch the user data and projects from the API
	const fetchUserData = async (uid) => {
		try {
			const response = await fetch(`/api/user/${uid}`);
			if (response.ok) {
				const { userData, userProjects } = await response.json(); // Corrected destructuring
				setUserData(userData);
				setProjects(userProjects || []); // Ensure projects is an array
			} else {
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			console.error("Error:", error);
			setMessage("An error occurred while fetching user data.");
		}
	};

	// Log userData once it's available
	useEffect(() => {
		if (userData) {
			console.log(userData);
		}
	}, [userData]);

	const handleFilterChange = (e) => {
		setFilter(e.target.value);
	};

	const filteredProjects = projects.filter((project) => {
		if (!user) return false;
		if (filter === "created") {
			return project.uid === user.uid; // Projects created by the user
		} else if (filter === "in-progress") {
			return project.status === "in progress"; // Projects user is working on
		} else if (filter === "completed") {
			return project.status === "closed"; // Completed projects
		}
		return true;
	});

	if (!userData) {
		return (
			<div className="min-h-screen bg-purple-100 flex items-center justify-center text-black">
				<p>Loading user data...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-purple-100 text-black">
			<header className="bg-lightblue p-4">
				<div className="container mx-auto">
					<h1 className="text-2xl font-bold">Account Information</h1>
				</div>
			</header>

			<main className="container mx-auto mt-8 px-4">
				<div className="bg-white shadow-lg rounded-lg max-w-2xl mx-auto p-6">
					<div className="space-y-6">
						{/* User Information Fields */}
						<div>
							<label className="block mb-2 font-medium text-black">
								<Type className="inline-block w-5 h-5 mr-2" />
								First Name
							</label>
							<p className="p-3 border border-gray-300 rounded-md">
								{userData.firstName}
							</p>
						</div>
						<div>
							<label className="block mb-2 font-medium text-black">
								<Type className="inline-block w-5 h-5 mr-2" />
								Last Name
							</label>
							<p className="p-3 border border-gray-300 rounded-md">
								{userData.lastName}
							</p>
						</div>
						<div>
							<label className="block mb-2 font-medium text-black">
								<FileText className="inline-block w-5 h-5 mr-2" />
								Email
							</label>
							<p className="p-3 border border-gray-300 rounded-md">
								{userData.email}
							</p>
						</div>
						<div>
							<label className="block mb-2 font-medium text-black">
								<FileText className="inline-block w-5 h-5 mr-2" />
								UID
							</label>
							<p className="p-3 border border-gray-300 rounded-md">
								{userData.uid}
							</p>
						</div>
						<div>
							<label className="block mb-2 font-medium text-black">
								<FileText className="inline-block w-5 h-5 mr-2" />
								Classification
							</label>
							<p className="p-3 border border-gray-300 rounded-md">
								{getUserClassification(userData.class)}
							</p>
						</div>
						{/* Message Display */}
						{message && (
							<div
								className={`mt-4 p-4 ${
									message.includes("successfully")
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								} border border-${
									message.includes("successfully") ? "green" : "red"
								}-300 rounded-md`}
							>
								<h3 className="text-lg font-semibold">
									{message.includes("successfully") ? "Status" : "Error"}
								</h3>
								<p>{message}</p>
							</div>
						)}
					</div>

					{/* Project Filter Section */}
					<div className="my-6">
						<label className="block mb-2 font-medium text-black">
							Filter Projects:
						</label>
						<select
							value={filter}
							onChange={handleFilterChange}
							className="p-2 border border-gray-300 rounded-md"
						>
							<option value="created">Created Projects</option>
							<option value="in-progress">In Progress</option>
							<option value="completed">Completed</option>
						</select>
					</div>

					{/* Render Projects */}
					<div className="my-6">
						<h2 className="text-xl font-bold">Projects</h2>
						{filteredProjects.length > 0 ? (
							filteredProjects.map((project) => (
								<div
									key={project.projectId}
									className="border p-4 rounded-lg shadow mb-4"
								>
									<h3 className="font-semibold">{project.title}</h3>
									<p>{project.desc}</p>
									<p>Status: {project.status}</p>
									<p>Cost: {parseFloat(project.cost.$numberDecimal || 0)}</p>
									<p>
										Donated: {parseFloat(project.donated.$numberDecimal || 0)}
									</p>
								</div>
							))
						) : (
							<p>No projects found.</p>
						)}
					</div>
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
