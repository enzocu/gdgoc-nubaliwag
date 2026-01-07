import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import LottieLoader from "../view/components/lottieLoader";
const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [currentPath, setPath] = useState("");

	useEffect(() => {
		if (
			!currentPath &&
			!location.pathname &&
			currentPath !== location.pathname
		) {
			setLoading(false);
		}
	}, [location.pathname, currentPath]);

	return (
		<LoadingContext.Provider value={{ loading, setLoading, setPath }}>
			<>
				{loading && (
					<div className="loading-container">
						<LottieLoader path="/assets/json/loading.json" loop={true} />
					</div>
				)}
				{children}
			</>
		</LoadingContext.Provider>
	);
};
