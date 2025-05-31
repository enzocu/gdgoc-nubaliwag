export const handleChange = (e, setState) => {
	const { name, value, files, type } = e.target;
	if (type === "file") {
		const fileUrl = URL.createObjectURL(files[0]);
		setState((prev) => ({ ...prev, [name]: fileUrl }));
	} else {
		setState((prev) => ({ ...prev, [name]: value }));
	}
};
