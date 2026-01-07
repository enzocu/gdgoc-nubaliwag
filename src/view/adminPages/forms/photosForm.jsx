import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import "../../../style/adminStyle/photos.css";
import { VscLinkExternal } from "react-icons/vsc";

import HeaderFormAdmin from "../../../view/components/headerFormAdmin";
import UrlUpload from "../../components/boostrap/urlModal";

import { useAlert } from "../../../provider/alertProvider";
import { useUser } from "../../../provider/userProvider";
import { useLoading } from "../../../provider/loadingProvider";

import { handleChange } from "../../../lib/helper/handleChange";
import { openModal } from "../../../lib/helper/showcloseModal";

import { insertPhoto } from "../../../lib/firebase/insert/insertPhoto";
import { updatePhoto } from "../../../lib/firebase/update/updatePhoto";
import { deletePhoto } from "../../../lib/firebase/delete/deletePhoto";
import { getPhotodetails } from "../../../lib/firebase/get/getPhotodetails";
import { getAcademicYears } from "../../../lib/firebase/get/getAcademicYears";

const defaultPhoto = {
	ph_ayID: "",
	ph_name: "",
	ph_date: "",
	ph_photoURL:
		"https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/gdsc_jaCyFcF.jpg",
};

function PhotosForm() {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const action = searchParams.get("action");
	const id = searchParams.get("id");

	const { triggerAlert } = useAlert();
	const { user, userDetails, loading } = useUser();
	const { setLoading, setPath } = useLoading();
	const photoImageref = useRef(null);

	const [btndelete, setBtndelete] = useState(false);
	const [btnloading, setBtnloading] = useState(false);
	const [photos, setPhoto] = useState(defaultPhoto);
	const [academicYear, setAcademicYear] = useState([]);

	const [url, setUrl] = useState({
		name: null,
		state: null,
		setState: () => {},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (action == "add") {
			if (!loading && user && userDetails) {
				insertPhoto(photos, triggerAlert, setBtnloading);
			}

			setPhoto(defaultPhoto);
		} else if (action == "edit" && id) {
			if (!btndelete) {
				updatePhoto(id, photos, triggerAlert, setBtnloading);
			} else {
				await deletePhoto(id, triggerAlert, setBtnloading);
				setBtndelete(false);
				goBack();
			}
		}
	};

	useEffect(() => {
		if (action === "edit" && id) {
			setPath(location.pathname);
			const unsubscribe = getPhotodetails(
				id,
				setPhoto,
				triggerAlert,
				setLoading,
			);
			return () => unsubscribe();
		}
	}, [id]);

	useEffect(() => {
		if (!loading && user && userDetails) {
			getAcademicYears(setAcademicYear);
		}
	}, [loading]);

	const goBack = () => {
		navigate(-1);
	};

	return (
		<div className="admin-body form">
			<UrlUpload name={url.name} state={url.state} setState={url.setState} />
			<main>
				<HeaderFormAdmin Title="Add Photo" />
				<form className="content-form photos" onSubmit={handleSubmit}>
					<section className="form-group-main">
						<div className="form-subgroup form-subgroup-details">
							<div className="form-field form-field-name">
								<label>Name</label>
								<input
									type="text"
									className="form-control"
									placeholder="Title"
									name="ph_name"
									value={photos.ph_name || ""}
									onChange={(e) => handleChange(e, setPhoto)}
									required
								/>
							</div>

							<div className="form-field-group form-field-date-year">
								<div className="form-field form-field-date">
									<label>Date</label>
									<input
										type="date"
										className="form-control"
										placeholder="Date"
										name="ph_date"
										value={photos.ph_date || ""}
										onChange={(e) => handleChange(e, setPhoto)}
										required
									/>
								</div>
								<div className="form-field form-field-year">
									<label>Academic Year</label>
									<select
										className="form-control"
										name="ph_ayID"
										value={photos.ph_ayID || ""}
										onChange={(e) => handleChange(e, setPhoto)}
										required
									>
										<option value="">Select Academic Year</option>
										{academicYear.map((item) => (
											<option key={item.id} value={item.id}>
												{`A.Y ${item.ay_academicyear}`}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						<div className="form-group form-group-image">
							<span>
								<label>Image</label>
								<VscLinkExternal
									className="upload-url"
									onClick={() => {
										openModal("urlModal");
										setUrl({
											name: "ph_photoURL",
											state: null,
											setState: setPhoto,
										});
									}}
								/>
							</span>
							<input
								type="file"
								className="form-control"
								name="ph_photoURL"
								ref={photoImageref}
								style={{ display: "none" }}
								onChange={(e) => handleChange(e, setPhoto)}
							/>
							<div
								className="form-image-container"
								onClick={() => photoImageref.current.click()}
							>
								<img
									src={
										photos.ph_photoURL instanceof File
											? URL.createObjectURL(photos.ph_photoURL)
											: photos.ph_photoURL
									}
									alt="Member Photo"
								/>
							</div>
						</div>
					</section>

					<section className="form-group form-group-buttons">
						<button type="submit" className="btn form-btn form-btn btn-primary">
							{btnloading && !btndelete ? (
								<span className="spinner-border spinner-border-sm"></span>
							) : (
								"Save"
							)}
						</button>
						{action === "edit" ? (
							<button
								onClick={() => setBtndelete(true)}
								type="submit"
								className="btn form-btn btn-outline-danger"
							>
								{btnloading && btndelete ? (
									<span className="spinner-border spinner-border-sm"></span>
								) : (
									"Delete"
								)}
							</button>
						) : (
							<button
								type="button"
								className="btn form-btn btn-outline-primary"
								onClick={goBack}
							>
								Cancel
							</button>
						)}
					</section>
				</form>
			</main>
		</div>
	);
}

export default PhotosForm;
