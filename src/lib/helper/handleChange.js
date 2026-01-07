export const handleChange = (e, setState) => {
	const { name, value, files, type } = e.target;
	if (type === "file") {
		setState((prev) => ({ ...prev, [name]: files[0] }));
	} else {
		setState((prev) => ({ ...prev, [name]: value }));
	}
};
