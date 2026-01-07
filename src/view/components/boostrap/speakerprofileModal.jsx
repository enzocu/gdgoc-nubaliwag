import React from "react";
const logo = "/assets/images/navlogo.png";
import "../../../style/bootstrapStyle/width.css";
const profileIcon = "/assets/images/profileicon.jpg";

const SpeakerDetails = ({ sp = null }) => {
	if (!sp) return null;

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
									src={sp.sp_photoURL || profileIcon}
									alt={sp.sp_name}
									className="core-photo"
								/>
								<div className="core-info">
									<h3>{sp.sp_name}</h3>
									<p className="member-position">Speaker</p>
									<div className="section-info">
										<label>About</label>
										<p>{sp.sp_info}</p>
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

export default SpeakerDetails;
