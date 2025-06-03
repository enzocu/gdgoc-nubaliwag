export const galleryChange = (input, setGallery) => {
	let fileUrl;

	if (typeof input === "string" && input.trim() !== "") {
		fileUrl = input;
	} else if (input && input[0]) {
		fileUrl = input[0];
	}

	setGallery((prevState) => [
		...prevState,
		{
			ga_id: null,
			ga_status: "Active",
			ga_photoURL: fileUrl,
		},
	]);
};
