import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";

const LottieLoader = ({ path, ...props }) => {
	const [animationData, setAnimationData] = useState(null);

	useEffect(() => {
		fetch(path)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to load ${path}`);
				}
				return res.json();
			})
			.then((data) => setAnimationData(data))
			.catch((err) => console.error("Failed to load lottie:", err));
	}, [path]);

	if (!animationData) return null;

	return <Lottie animationData={animationData} {...props} />;
};

export default LottieLoader;
