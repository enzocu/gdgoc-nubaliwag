import { Routes, Route } from "react-router-dom";
import "../../style/userStyle/user.css";

import HomePage from "./homePage";
import MembersPage from "./membersPage";
import EventsPage from "./eventsPage";
import ProjectsPage from "./projectsPage";
import ContactPage from "./contactPage";
import EventsDetailsPage from "./details/eventsDetails";

function UserRoutes() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/user/events" element={<EventsPage />} />
			<Route path="/user/coreteam" element={<MembersPage />} />
			<Route path="/user/projects" element={<ProjectsPage />} />
			<Route path="/user/contact" element={<ContactPage />} />

			{/* Details */}
			<Route
				path="/user/events/eventsdetails"
				element={<EventsDetailsPage />}
			/>
		</Routes>
	);
}

export default UserRoutes;
