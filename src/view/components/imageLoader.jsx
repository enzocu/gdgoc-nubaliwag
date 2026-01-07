import React, { useState } from "react";

function ImageLoader({ src, alt, className = "", style = {} }) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	return (
		<div
			className={`image-loader-container ${className}`}
			style={{
				position: "relative",
				overflow: "hidden",
				backgroundColor: "var(--img-bg-color)",
				...style,
			}}
		>
			{!isLoaded && (
				<div
					className="skeleton"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						zIndex: 1,
					}}
				/>
			)}
			<img
				src={src}
				alt={alt}
				style={{
					opacity: isLoaded ? 1 : 0,
					transition: "opacity 0.5s ease-in-out",
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: "block",
				}}
				onLoad={() => setIsLoaded(true)}
				onError={(e) => {
					setIsLoaded(true);
					setHasError(true);
					// Optional: Set a fallback image if needed
				}}
			/>
			{hasError && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						backgroundColor: "var(--img-bg-color)",
						color: "var(--sec-text-color)",
						fontSize: "0.8rem",
						zIndex: 2,
					}}
				>
					<span>Image not found</span>
				</div>
			)}
		</div>
	);
}

export default ImageLoader;
