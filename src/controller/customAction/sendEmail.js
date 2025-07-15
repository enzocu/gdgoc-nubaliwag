import emailjs from "emailjs-com";
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function sendOrganizerEmail(
	us_name,
	us_email,
	ev_photoURL,
	ev_name,
	ev_date,
	ev_starttime,
	ev_endtime,
	ev_location,
	ev_overview,
	event_id,
	triggerAlert
) {
	const serviceID = "service_msp6g2q";
	const templateID = "template_jd2jj0l";

	const templateParams = {
		us_name,
		us_email,
		ev_photoURL,
		ev_name,
		ev_date,
		ev_starttime,
		ev_endtime,
		ev_location,
		ev_overview,
		event_id,
	};

	emailjs
		.send(serviceID, templateID, templateParams, publicKey)
		.catch((error) => {
			console.error("❌ Email send failed:", error);
			if (typeof triggerAlert === "function") {
				triggerAlert("warning", "Error sending email: " + error.message);
			}
		});
}

export function sendContactUsEmail(
	co_name,
	co_email,
	co_inquiry,
	co_subject,
	co_message,
	triggerAlert,
	setBtnloading
) {
	setBtnloading(true);

	const serviceID = "service_msp6g2q";
	const templateID = "template_eii54o8";

	const templateParams = {
		co_name,
		co_email,
		co_inquiry,
		co_subject,
		co_message,
	};

	emailjs
		.send(serviceID, templateID, templateParams, publicKey)
		.then(() => {
			if (typeof triggerAlert === "function") {
				triggerAlert("success", "Message sent successfully!");
			}
		})
		.catch((error) => {
			console.error("❌ Email send failed:", error);
			if (typeof triggerAlert === "function") {
				triggerAlert("danger", "Error sending email: " + error.message);
			}
		})
		.finally(() => {
			if (typeof setBtnloading === "function") {
				setBtnloading(false);
			}
		});
}
