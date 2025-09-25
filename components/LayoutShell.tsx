"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ScrollProgress from "./ui/ScrollProgress";


export default function LayoutShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAdmin = pathname.startsWith("/admin");
	return (
		<>
			{!isAdmin && <Header />}
				{!isAdmin && <ScrollProgress />}
			{/* <ScrollProgress/> */}
			<main className="flex-1">{children}</main>
			{!isAdmin && <Footer />}
		</>
	);
}
