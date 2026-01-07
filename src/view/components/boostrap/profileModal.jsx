import React from "react";
const logo = "/assets/images/navlogo.png";
import "../../../style/bootstrapStyle/width.css";
const profileIcon = "/assets/images/profileicon.jpg";

const ProfileDetails = ({ profileDetails }) => {
	// Don't early return if profileDetails is null to allow the modal structure to exist in DOM for Bootstrap initialization
	// But we handle null data gracefully inside the render

	const fullName = profileDetails
		? [
				profileDetails.us_fname,
				profileDetails.us_mname,
				profileDetails.us_lname,
				profileDetails.us_suffix,
		  ]
				.filter(Boolean)
				.join(" ")
		: "";

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
							{profileDetails ? (
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
										<div className="profile-group">
											<div className="field">
												<label>Student Number</label>
												<input
													className="form-control"
													value={profileDetails.us_studentID || "N/A"}
													readOnly
												/>
											</div>
											<div className="field">
												<label>Email</label>
												<input
													className="form-control"
													value={profileDetails.us_email || "N/A"}
													readOnly
												/>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div style={{ padding: "20px", textAlign: "center" }}>
									Loading...
								</div>
							)}
						</div>
						<div className="modal-footer"></div>
					</form>
				</section>
			</div>
		</div>
	);
};

export default ProfileDetails;
