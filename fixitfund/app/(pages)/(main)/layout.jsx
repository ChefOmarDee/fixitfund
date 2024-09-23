import Navbar from "./nav.jsx";

export const metadata = {
	title: "FixItFund",
	description: "FixItFund",
};

export default function RootLayout({ children }) {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-grow">{children}</main>
		</div>
	);
}
