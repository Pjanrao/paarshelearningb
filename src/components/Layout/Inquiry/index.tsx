"use client";
import React, { useState } from "react";
import "./style.css";
import toast from "react-hot-toast";
import { validateEmail, validatePhone, validateName, validateMessage } from "@/utils/validation";

const Inquiry = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id === "phone") {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [id]: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!validateName(formData.name)) {
            toast.error("Name must be 2–60 characters and contain only letters.");
            return;
        }

        if (!validateEmail(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            toast.error("Phone number must be exactly 10 digits.");
            return;
        }

        if (!validateMessage(formData.message, 5)) {
            toast.error("Message must be at least 5 characters.");
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading("Sending your inquiry...");

        try {
            const response = await fetch("/api/inquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, type: "Inquiry Form" }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Inquiry submitted successfully!", { id: loadingToast });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    course: "",
                    message: ""
                });
            } else {
                toast.error(result.error || "Failed to submit inquiry.", { id: loadingToast });
            }
        } catch (error) {
            console.error("Inquiry error:", error);
            toast.error("An error occurred. Please try again later.", { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="inquiry-section" id="inquiry">
            <div className="inquiry-container">
                <div className="inquiry-row">
                    <div className="inquiry-content">
                        <h4 className="inquiry-subtitle">Inquiry</h4>
                        <h2 className="inquiry-title">
                            Have Questions? <br /> <span className="highlight">Let's Connect!</span>
                        </h2>
                        <p className="inquiry-description">
                            Fill out the form below and our team will get back to you with all the answers you need to kickstart your journey with Paarsh E-Learning.
                        </p>

                        <div className="bg-decoration">
                            <div className="blob blob-1"></div>
                            <div className="blob blob-2"></div>
                            <div className="blob blob-3"></div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="inquiry-form-wrapper">
                        <div className="inquiry-card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="course" className="form-label">Interested Course</label>
                                    <div className="select-wrapper">
                                        <select
                                            id="course"
                                            className="form-select"
                                            value={formData.course}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select a course</option>
                                            <option value="web-development">Web Development</option>
                                            <option value="data-science">Data Science</option>
                                            <option value="digital-marketing">Digital Marketing</option>
                                            <option value="full-stack">Full Stack Development</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div className="select-icon">
                                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        placeholder="Tell us more about your requirements..."
                                        className="form-textarea"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Inquiry;