import { useState } from "react";
import "../../style/userStyle/eventsprojects.css";
const project = "/assets/images/project.png";

import LottieLoader from "../components/lottieLoader";

import { IoCalendarClearOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

import Footer from "../components/footer";

function ProjectsPage() {
	const [activeTab, setActiveTab] = useState("upcoming");

	return (
		<>
			<div className="user-body project">
				<main>
					<section className="header-container">
						<div className="header-content">
							<h1>Under Maintenance</h1>
							<p>
								The Projects page is currently being updated. Please check back
								soon for exciting innovations from GDG: On Campus NU Baliwag.
							</p>
						</div>
					</section>
					<section className="gdg-container">
						<div className="maintenance-lottie-container">
							<LottieLoader
								path="/assets/json/underMaintenance.json"
								loop={true}
							/>
						</div>
					</section>
					{/* <section className="gdg-container">
						<div className="gdg-search-container">
							<span className="gdg-search-icon">
								<FiSearch />
							</span>
							<input
								type="text"
								placeholder="Search Project"
								className="form-control gdg-search-input"
							/>
						</div>

						<div className="gdg-grid project">
							<div className="gdg-event-card">
								<div className="gdg-event-image">
									<span className="gdg-event-type">Conference</span>
									<img src={project} alt="" />
								</div>
								<div className="gdg-event-content">
									<h3 className="gdg-event-title">UXplorer</h3>

									<div className="gdg-event-details">
										<div className="gdg-event-detail">
											<IoCalendarClearOutline className="gdg-event-icon" />
											<span>August 30, 2024</span>
										</div>
										<div className="gdg-event-detail">
											<IoTimeOutline className="gdg-event-icon" />
											<span>10:00 AM - 5:00 PM</span>
										</div>
										<div className="gdg-event-detail">
											<IoLocationOutline className="gdg-event-icon" />
											<span>Room 306</span>
										</div>
									</div>
									<p className="gdg-event-description">
										A creative UX workshop to explore modern design trends.
									</p>
								</div>
							</div>

							<div className="gdg-event-card">
								<div className="gdg-event-image">
									<span className="gdg-event-type">Conference</span>
									<img src={project} alt="" />
								</div>
								<div className="gdg-event-content">
									<h3 className="gdg-event-title">UXplorer</h3>

									<div className="gdg-event-details">
										<div className="gdg-event-detail">
											<IoCalendarClearOutline className="gdg-event-icon" />
											<span>August 30, 2024</span>
										</div>
										<div className="gdg-event-detail">
											<IoTimeOutline className="gdg-event-icon" />
											<span>10:00 AM - 5:00 PM</span>
										</div>
										<div className="gdg-event-detail">
											<IoLocationOutline className="gdg-event-icon" />
											<span>Room 306</span>
										</div>
									</div>
									<p className="gdg-event-description">
										A creative UX workshop to explore modern design trends.
									</p>
								</div>
							</div>

							<div className="gdg-event-card">
								<div className="gdg-event-image">
									<span className="gdg-event-type">Conference</span>
									<img src={project} alt="" />
								</div>
								<div className="gdg-event-content">
									<h3 className="gdg-event-title">UXplorer</h3>

									<div className="gdg-event-details">
										<div className="gdg-event-detail">
											<IoCalendarClearOutline className="gdg-event-icon" />
											<span>August 30, 2024</span>
										</div>
										<div className="gdg-event-detail">
											<IoTimeOutline className="gdg-event-icon" />
											<span>10:00 AM - 5:00 PM</span>
										</div>
										<div className="gdg-event-detail">
											<IoLocationOutline className="gdg-event-icon" />
											<span>Room 306</span>
										</div>
									</div>
									<p className="gdg-event-description">
										A creative UX workshop to explore modern design trends.
									</p>
								</div>
							</div>

							<div className="gdg-event-card">
								<div className="gdg-event-image">
									<span className="gdg-event-type">Conference</span>
									<img src={project} alt="" />
								</div>
								<div className="gdg-event-content">
									<h3 className="gdg-event-title">UXplorer</h3>

									<div className="gdg-event-details">
										<div className="gdg-event-detail">
											<IoCalendarClearOutline className="gdg-event-icon" />
											<span>August 30, 2024</span>
										</div>
										<div className="gdg-event-detail">
											<IoTimeOutline className="gdg-event-icon" />
											<span>10:00 AM - 5:00 PM</span>
										</div>
										<div className="gdg-event-detail">
											<IoLocationOutline className="gdg-event-icon" />
											<span>Room 306</span>
										</div>
									</div>
									<p className="gdg-event-description">
										A creative UX workshop to explore modern design trends.
									</p>
								</div>
							</div>
						</div>
					</section> */}
				</main>
				<Footer />
			</div>
		</>
	);
}

export default ProjectsPage;
