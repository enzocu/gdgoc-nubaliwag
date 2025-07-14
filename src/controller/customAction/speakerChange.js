export const speakerChange = (event, setSpeaker, setEvent) => {
	setSpeaker((prevState) => [
		...prevState,
		{
			sp_id: null,
			sp_status: "Active",
			sp_name: event.ev_spname,
			sp_info: event.ev_spinfo,
			sp_photoURL: event.ev_spphotoURL,
		},
	]);

	setEvent((prevState) => ({
		...prevState,
		ev_spname: "",
		ev_spinfo: "",
		ev_spphotoURL: "",
	}));
};

export const selectedSpeaker = (index, speaker, setEvent) => {
	setEvent((prevEvent) => ({
		...prevEvent,
		ev_spindex: index,
		ev_spid: speaker[index].sp_id,
		ev_spname: speaker[index].sp_name,
		ev_spinfo: speaker[index].sp_info,
	}));
};

export const updateSpeaker = (event, speaker, setspeaker, setevent) => {
	const {
		ev_spindex,
		ev_spid = null,
		ev_spname = "",
		ev_spinfo = "",
		ev_spphotoURL = "",
	} = event;

	const copy = [...speaker];
	copy[ev_spindex] = {
		sp_id: ev_spid,
		sp_status: "Active",
		sp_name: ev_spname,
		sp_info: ev_spinfo,
		sp_photoURL: ev_spphotoURL,
	};

	setspeaker(copy);
	setevent((prevState) => ({
		...prevState,
		ev_spindex: null,
		ev_spid: null,
		ev_spname: "",
		ev_spinfo: "",
		ev_spphotoURL: "",
	}));
};
