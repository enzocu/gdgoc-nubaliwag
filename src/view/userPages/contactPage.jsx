import React, { useState } from "react";
import "../../style/userStyle/contacts.css";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";

import Footer from "../components/footer";
import { useAlert } from "../context/alertProvider";
import { handleChange } from "../../controller/customAction/handleChange";
import { sendContactUsEmail } from "../../controller/customAction/sendEmail";

const defaultContact = {
	co_name: "",
	co_email: "",
	co_inquiry: "",
	co_subject: "",
	co_message: "",
};

function ContactPage() {
	const { triggerAlert } = useAlert();
	const [btnloading, setBtnloading] = useState(false);
	const [contact, setContact] = useState(defaultContact);

	const handleSubmit = (e) => {
		e.preventDefault();

		sendContactUsEmail(
			contact.co_name,
			contact.co_email,
			contact.co_inquiry,
			contact.co_subject,
			contact.co_message,
			triggerAlert,
			setBtnloading
		);
		// Reset form after submission
		setContact(defaultContact);
	};

	return (
		<>
			<div className="user-body contact">
				<main>
					<section className="header-container">
						<div className="header-content">
							<h1>Contact Us</h1>
							<p>
								Get in touch with GDG On Campus NU Baliwag. We'd love to hear
								from you!
							</p>
						</div>
					</section>

					{/* Contact Content */}
					<section className="gdg-contact-content">
						<div className="gdg-contact-grid">
							{/* Get In Touch Section */}
							<div className="gdg-get-in-touch">
								<h2>Get In Touch</h2>
								<p>
									Have questions about our events or are you interested in
									joining? Fill out the form and we'll get back to you as soon
									as possible.
								</p>

								<div className="gdg-contact-info">
									<div className="gdg-info-item">
										<IoLocationOutline className="gdg-info-icon" />
										<div>
											<p className="gdg-info-label">Address</p>
											<p>SM Baliwag Complex, Doña Remedios Trinidad,</p>
											<p>Highway, Brgy. Pagala, Baliuag, Bulacan 3006</p>
										</div>
									</div>

									<div className="gdg-info-item">
										<MdOutlineMailOutline className="gdg-info-icon" />
										<div>
											<p className="gdg-info-label">Email</p>
											<p>gdsc@nu-baliwag.edu.ph</p>
										</div>
									</div>

									<div className="gdg-info-item">
										<LuPhone className="gdg-info-icon" />
										<div>
											<p className="gdg-info-label">Phone</p>
											<p>+63 912 345 6789</p>
										</div>
									</div>
								</div>
							</div>

							{/* Contact Form */}
							<div className="gdg-contact-form-container">
								<h2>Send us a message</h2>
								<p>
									Fill out the form below and we'll get back to you as soon as
									possible.
								</p>

								<form className="gdg-contact-form" onSubmit={handleSubmit}>
									<div className="gdg-form-row">
										<div className="gdg-form-group">
											<label htmlFor="name">Name</label>
											<input
												type="text"
												id="name"
												placeholder="Your Name"
												className="form-control"
												name="co_name"
												required
												value={contact.co_name || ""}
												onChange={(e) => handleChange(e, setContact)}
											/>
										</div>

										<div className="gdg-form-group">
											<label htmlFor="email">Email</label>
											<input
												type="email"
												id="email"
												placeholder="Your Email"
												className="form-control"
												name="co_email"
												required
												value={contact.co_email || ""}
												onChange={(e) => handleChange(e, setContact)}
											/>
										</div>
									</div>

									<div className="gdg-form-group">
										<label htmlFor="inquiryType">Inquiry Type</label>
										<select
											id="inquiryType"
											className="form-control"
											name="co_inquiry"
											required
											value={contact.co_inquiry || ""}
											onChange={(e) => handleChange(e, setContact)}
										>
											<option value="">Inquiry Type</option>
											<option value="general">General Inquiry</option>
											<option value="membership">Membership</option>
											<option value="events">Events</option>
											<option value="partnership">Partnership</option>
										</select>
									</div>

									<div className="gdg-form-group">
										<label htmlFor="subject">Subject</label>
										<input
											type="text"
											id="subject"
											placeholder="Subject of Your Message"
											className="form-control"
											name="co_subject"
											required
											value={contact.co_subject || ""}
											onChange={(e) => handleChange(e, setContact)}
										/>
									</div>

									<div className="gdg-form-group">
										<label htmlFor="message">Message</label>
										<textarea
											id="message"
											rows="5"
											placeholder="Your Message"
											className="form-control"
											name="co_message"
											required
											value={contact.co_message || ""}
											onChange={(e) => handleChange(e, setContact)}
										></textarea>
									</div>

									<button type="submit" className="btn gdg-send-message-btn">
										{btnloading ? (
											<span className="spinner-border spinner-border-sm"></span>
										) : (
											"Send Message"
										)}
									</button>
								</form>
							</div>
						</div>
					</section>
				</main>
				<Footer />
			</div>
		</>
	);
}

export default ContactPage;
