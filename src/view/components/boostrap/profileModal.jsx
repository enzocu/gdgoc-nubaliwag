import React from "react";
import logo from "../../../assets/navlogo.png";
import "../../../style/bootstrapStyle/width.css";
import profileIcon from "../../../assets/profileicon.jpg";

const ProfileDetails = ({ profileDetails = null }) => {
	if (!profileDetails || !profileDetails.us_studentID) return null;

	const fullName = [
		profileDetails.us_fname,
		profileDetails.us_mname,
		profileDetails.us_lname,
		profileDetails.us_suffix,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div
			className="modal fade"
			id="profileModal"
			tabIndex="-1"
			aria-labelledby="eventstatModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-lg profile">
				<section className="modal-content">
					<form>
						<div className="modal-header">
							<img src={logo} alt="GDSC Logo" className="logo-container" />
							<div className="header-details">
								<h4>Google Developer Groups on Campus</h4>
								<p>National University Baliwag</p>
							</div>
						</div>

						<div className="modal-body">
							<div className="core-member">
								<img
									src={profileDetails.us_photoURL || profileIcon}
									className="core-photo"
									alt="Profile"
								/>
								<div className="core-info">
									<h3>{fullName || "No Name Provided"}</h3>
									<p className="member-position">
										{profileDetails.ro_name || "N/A"} |{" "}
										<span>
											{profileDetails.ro_type || "Unknown"} {" A.Y "}
											{profileDetails.us_yearName || "----"}
										</span>
									</p>
									<div className="section-info">
										<label>ID</label>
										<p>{profileDetails.us_studentID || "N/A"}</p>
									</div>
									<div className="section-info">
										<label>Email</label>
										<p>{profileDetails.us_email || "N/A"}</p>
									</div>
								</div>
							</div>
						</div>
					</form>
				</section>
			</div>
		</div>
	);
};

export default ProfileDetails;
