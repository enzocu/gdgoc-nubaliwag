import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../style/adminStyle/photos.css";

import { MdAdd } from "react-icons/md";
import LottieLoader from "../components/lottieLoader";

import SideBar from "../components/sideBar";
import HeaderPageAdmin from "../components/headerPageAdmin";

import { useUser } from "../../provider/userProvider";
import { useLoading } from "../../provider/loadingProvider";
import { useAlert } from "../../provider/alertProvider";

import { toggleDropdown } from "../../lib/helper/showcloseModal";

import { getAcademicYears } from "../../lib/firebase/get/getAcademicYears";
import getPhotos from "../../lib/firebase/get/getPhotos";

function PhotosPage() {
	const location = useLocation();

	const { triggerAlert } = useAlert();
	const { user, userDetails, loading: userLoading } = useUser();
	const { setLoading, setPath, loading: appLoading } = useLoading();

	const [search, setSearch] = useState(null);
	const [photo, setPhoto] = useState([]);
	const [academicYear, setAcademicYear] = useState([]);
	const [acadyear, setAcadyear] = useState(null);

	useEffect(() => {
		if (!userLoading && user && userDetails) {
			setPath(location.pathname);

			getPhotos(
				acadyear == null ? userDetails.us_ayID.id : acadyear,
				search,
				setPhoto,
				setLoading,
				triggerAlert,
				100,
			);
		}
	}, [userLoading, search, acadyear]);

	useEffect(() => {
		if (!userLoading && user && userDetails) {
			getAcademicYears(setAcademicYear);
		}
	}, [userLoading]);

	return (
		<>
			<div className="admin-body">
				<SideBar />
				<main>
					<HeaderPageAdmin Title="Photos" />
					<div className="content-page photos">
						<section className="function-container">
							<div className="filter-group">
								<div className="input-group ">
									<input
										type="text"
										className="form-control"
										placeholder="Search"
										value={search || ""}
										onChange={(e) => setSearch(e.target.value)}
									/>

									<button
										type="button"
										className="btn btn-outline-primary dropdown-toggle form-btn"
										data-bs-toggle="dropdown"
										onClick={() => toggleDropdown("acadyear")}
									>
										Academic Year
									</button>
									<ul className="dropdown-menu form-menu" id="acadyear">
										{academicYear.map((item) => (
											<li
												className="dropdown-item"
												key={item.id}
												onClick={() => {
													setAcadyear(item.id);
													toggleDropdown("acadyear");
												}}
											>{`A.Y ${item.ay_academicyear}`}</li>
										))}
									</ul>
								</div>
							</div>

							<NavLink to="/admin/photos/photosform?action=add">
								<button className="btn btn-primary form-btn">
									<MdAdd />
									<span>Add Photo</span>
								</button>
							</NavLink>
						</section>

						{!appLoading && photo.length === 0 ? (
							<div className="no-event-lottie-container">
								<LottieLoader path="/assets/json/noevent.json" loop={true} />
							</div>
						) : (
							<section className="photos-list">
								{photo.map((ph) => (
									<NavLink
										key={ph.id}
										to={`/admin/photos/photosform?action=edit&id=${ph.id}`}
									>
										<div className="photos-card">
											<div className="photos-photo">
												<img src={ph.ph_photoURL} alt={ph.ph_name || "Photo"} />
											</div>
											<div className="details">
												<h4>{ph.ph_name || "Untitled"}</h4>
												<p>
													{ph.ph_date
														? new Date(
																ph.ph_date.seconds * 1000,
														  ).toLocaleDateString(undefined, {
																year: "numeric",
																month: "short",
																day: "numeric",
														  })
														: "Date N/A"}
												</p>
											</div>
										</div>
									</NavLink>
								))}
							</section>
						)}
					</div>
				</main>
			</div>
		</>
	);
}

export default PhotosPage;
