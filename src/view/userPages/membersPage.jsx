import { useState, useEffect } from "react";
import "../../style/userStyle/member.css";
import { useLocation } from "react-router-dom";
const profileIcon = "/assets/images/profileicon.jpg";

import Footer from "../components/footer";
import UrlUpload from "../components/boostrap/urlModal";
import ProfileDetails from "../components/boostrap/profileModal";

import { useAlert } from "../../provider/alertProvider";
import { useAcadYear } from "../../provider/acadyearProvider";
import { useLoading } from "../../provider/loadingProvider";

import { openModal } from "../../lib/helper/showcloseModal";
import { getMembersRoles } from "../../lib/firebase/get/getUserRoles";

function MembersPage() {
	const location = useLocation();
	const { acadYear, loading } = useAcadYear();
	const { triggerAlert } = useAlert();
	const { setLoading, setPath } = useLoading();

	const [member, setMember] = useState([]);
	const [profileDetails, setProfileDetails] = useState([]);

	useEffect(() => {
		if (!loading && acadYear) {
			setPath(location.pathname);
			getMembersRoles(acadYear.id, setMember, setLoading, triggerAlert);
		}
	}, [loading, acadYear]);

	return (
		<>
			<UrlUpload />
			<ProfileDetails profileDetails={profileDetails} />
			<div className="user-body member">
				<main>
					<section className="header-container">
						<div className="header-content">
							<h1>Meet Our Members</h1>
							<p>Get to know the faces behind GDG On Campus NU Baliwag.</p>
						</div>
					</section>

					{renderSingleRoleSection(
						"Organization Lead",
						member,
						setProfileDetails,
					)}
					{renderSingleRoleSection("Adviser", member, setProfileDetails)}

					{renderMembers(
						"Executive Board",
						"Department leaders who coordinate and oversee specific areas of the organization",
						member["Executive Board"],
						setProfileDetails,
					)}
					{renderMembers(
						"Core Leads",
						"Department leaders who coordinate and oversee specific areas of the organization",
						member["Core Lead"],
						setProfileDetails,
					)}
					{renderMembers(
						"Operations Department",
						"Responsible for event planning, communications, and member engagement",
						member["Operations Department"],
						setProfileDetails,
					)}
					{renderMembers(
						"Finance Department",
						"Manages budgeting and financial planning for the organization.",
						member["Finance Department"],
						setProfileDetails,
					)}
					{renderMembers(
						"Technology Department",
						"Leads technical workshops, develops projects, and provides technical expertise.",
						member["Technology Department"],
						setProfileDetails,
					)}
				</main>
				<Footer />
			</div>
		</>
	);
}

export default MembersPage;

const renderMembers = (title, description, membersList, setProfileDetails) => {
	if (!membersList || membersList.length === 0) return null;

	return (
		<section className="core-board-section">
			<div className="section-container">
				<h2>{title}</h2>
				{description && (
					<p className="section-description-member">{description}</p>
				)}
				<div className="core-board-grid">
					{membersList.map((member, index) => {
						const fullName = [
							member.us_fname,
							member.us_mname,
							member.us_lname,
							member.us_suffix,
						]
							.filter(Boolean)
							.join(" ");

						return (
							<div className="core-member" key={index}>
								<img
									src={member.us_photoURL || profileIcon}
									alt={fullName || "Profile"}
									className="core-photo"
								/>
								<div className="core-info">
									<h3>{fullName || "No Name Provided"}</h3>
									<p className="member-position">{member.ro_name || "N/A"}</p>
									<p className="member-org">
										Google Developer Groups On Campus
									</p>
									<p className="member-school">National University Baliwag</p>
									<a
										href="#"
										className="view-profile"
										onClick={(e) => {
											e.preventDefault();
											setProfileDetails(member);
											openModal("profileModal");
										}}
									>
										View Profile
									</a>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

const renderSingleRoleSection = (
	roleTitle = "Organization Lead",
	member,
	setProfileDetails,
) => {
	const roleData = member[roleTitle]?.[0];
	if (!roleData) return null;

	const fullName = [
		roleData.us_fname,
		roleData.us_mname,
		roleData.us_lname,
		roleData.us_suffix,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<section className="org-lead-section">
			<div className="section-container">
				<h2>{roleTitle}</h2>
				<div className="org-lead-content">
					<div className="org-lead-info">
						<h3>{fullName}</h3>
						<p className="member-position">{roleTitle}</p>
						<p className="member-org">Google Developer Groups On Campus</p>
						<p className="member-school">National University Baliwag</p>
						<a
							href="#"
							className="view-profile"
							onClick={(e) => {
								e.preventDefault();
								setProfileDetails(roleData);
								openModal("profileModal");
							}}
						>
							View Profile
						</a>
					</div>
					<img
						src={roleData.us_photoURL || profileIcon}
						alt={`${roleTitle.toLowerCase().replace(/\s/g, "-")}-photo`}
						className="org-lead-photo"
					/>
				</div>
			</div>
		</section>
	);
};
