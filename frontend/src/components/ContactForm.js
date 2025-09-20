import React, { useState } from "react";

function ContactForm({ addContact }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone must be 10 digits");
      return;
    }
    if (!/.+@.+\..+/.test(form.email)) {
      alert("Invalid email format");
      return;
    }
    addContact(form);
    setForm({ name: "", email: "", phone: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <button type="submit">Add Contact</button>
    </form>
  );
}

export default ContactForm;
