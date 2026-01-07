import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../../style/adminStyle/members.css";
const profileIcon = "/assets/images/profileicon.jpg";

import { MdAdd } from "react-icons/md";
import { BiSort } from "react-icons/bi";
import LottieLoader from "../components/lottieLoader";
import ImageLoader from "../components/imageLoader";

import SideBar from "../../view/components/sideBar";
import HeaderPageAdmin from "../../view/components/headerPageAdmin";

import { useUser } from "../../provider/userProvider";
import { useLoading } from "../../provider/loadingProvider";
import { useAlert } from "../../provider/alertProvider";

import { toggleDropdown } from "../../lib/helper/showcloseModal";

import { getMembers } from "../../lib/firebase/get/getCoreMembers";
import { getAcademicYears } from "../../lib/firebase/get/getAcademicYears";

function MembersPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { triggerAlert } = useAlert();
	const { user, userDetails, loading: userLoading } = useUser();
	const { setLoading, setPath, loading: appLoading } = useLoading();

	const [search, setSearch] = useState(null);
	const [roType, setType] = useState(null);
	const [member, setMember] = useState([]);
	const [academicYear, setAcademicYear] = useState([]);
	const [acadyear, setAcadyear] = useState(null);

	useEffect(() => {
		if (!userLoading && user && userDetails) {
			setPath(location.pathname);
			getMembers(
				acadyear == null ? userDetails.us_ayID.id : acadyear,
				roType,
				search,
				setMember,
				setLoading,
				triggerAlert,
				100,
			);
		}
	}, [userLoading, search, roType, acadyear]);

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
					<HeaderPageAdmin Title="Core Members" />
					<div className="content-page members">
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

							<NavLink to="/admin/members/membersform?action=add">
								<button className="btn btn-primary form-btn">
									<MdAdd />
									<span>Add Core Member</span>
								</button>
							</NavLink>
						</section>
						{member.length > 0 ? (
							<section className="member-list">
								<table className="core-table">
									<thead>
										<tr>
											<th>Avatar</th>
											<th>
												Name <BiSort />
											</th>
											<th>ID</th>
											<th>Email</th>
											<th>
												Role Type <BiSort />
											</th>
											<th>
												Role <BiSort />
											</th>

											<th>Academic Year</th>
										</tr>
									</thead>
									<tbody>
										{member.map((item, index) => {
											const acad = item.us_acadyear?.[0] || {};
											const roles = acad.us_role || [];

											return (
												<tr
													key={item.id || index}
													onClick={() =>
														navigate(
															`/admin/members/membersform?action=edit&id=${item.id}`,
														)
													}
												>
													<td>
														<div className="profile-pic">
															<ImageLoader
																src={item.us_photoURL || profileIcon}
																alt="Profile"
																style={{
																	width: "100%",
																	height: "100%",
																	borderRadius: "50%",
																}}
															/>
														</div>
													</td>
													<td className="min200">
														{item.us_fname || item.us_mname || item.us_lname
															? `${item.us_fname || ""} ${
																	item.us_mname || ""
															  } ${item.us_lname || ""} ${
																	item.us_suffix || ""
															  }`.trim()
															: "No name"}
													</td>
													<td className="min">{item.us_studentID || "N/A"}</td>
													<td className="min">{item.us_email || "No email"}</td>
													<td className="min250">
														<ul className="role-ul">
															{roles.map((r, i) => (
																<li key={i}>{r.type || "N/A"}</li>
															))}
														</ul>
													</td>
													<td className="min250">
														<ul className="role-ul">
															{roles.map((r, i) => (
																<li key={i}>{r.role || "N/A"}</li>
															))}
														</ul>
													</td>

													<td className="min">{acad.us_yrname || "N/A"}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</section>
						) : !appLoading && member.length === 0 ? (
							<div className="no-event-lottie-container">
								<LottieLoader path="/assets/json/noevent.json" loop={true} />
							</div>
						) : null}
					</div>
				</main>
			</div>
		</>
	);
}

export default MembersPage;
