"use client";

import React, { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const [authorized, setAuthorized] = useState(false);

	useEffect(() => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (!token) {
			window.location.href = "/admin/login";
			return;
		}
		setAuthorized(true);
	}, []);

	if (!authorized) return null;
	return <>{children}</>;
}
