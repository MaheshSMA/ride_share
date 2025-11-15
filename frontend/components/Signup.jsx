import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    age: "",
    gender: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log("first");
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      console.log(form);
      alert(res.data.message);
    } catch (err) {
       console.error("Signup error:", err.message); // ← THIS is key
       
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

      <form className="signup-form" onSubmit={handleSignup}>
        <input name="name" placeholder="Name" onChange={handleChange} />

        <input name="username" placeholder="Username" onChange={handleChange} />

        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <input name="age" type="number" placeholder="Age" onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>male</option>
          <option>female</option>
          <option>other</option>
        </select>

        <input name="email" type="email" placeholder="Email" onChange={handleChange} />

        <button type="submit">Sign Up</button>
      </form>

      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
