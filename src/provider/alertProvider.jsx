import React, { createContext, useContext, useState, useEffect } from "react";

const AlertContext = createContext();
export const useAlert = () => useContext(AlertContext);

const TopAlertProvider = ({ children }) => {
	const [alert, setAlert] = useState({ type: "", message: "" });
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => setShow(false), 4000);
			return () => clearTimeout(timer);
		}
	}, [show]);

	const triggerAlert = (type, message) => {
		setAlert({ type, message });
		setShow(true);
	};

	return (
		<AlertContext.Provider value={{ triggerAlert }}>
			{show && (
				<div
					className={`custom-alert alert alert-${alert.type} alert-dismissible fade show`}
					role="alert"
				>
					<div className="d-flex align-items-center">
						<div className="alert-content">{alert.message}</div>
						<button
							type="button"
							className="btn-close"
							onClick={() => setShow(false)}
							aria-label="Close"
						></button>
					</div>
				</div>
			)}
			{children}
		</AlertContext.Provider>
	);
};

export default TopAlertProvider;
