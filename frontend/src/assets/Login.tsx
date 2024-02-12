import React, { useState } from "react";
import "./Register.css";

const Register: React.FC = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitted:", { username, password });

    const response = await fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }), // body data type must match "Content-Type" header
    });
    var data = await response.json();
    console.log(data);

    setMessage(data.message);

    if (data.message == "Success") {
      var token = data.token;
      localStorage.setItem("token", token);
      if (typeof window !== "undefined") {
        window.setTimeout(function () {
          window.location = "/dashboard";
        }, 2000);
      }
    }

    // You can perform further actions here, like sending the data to a server
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1>{message == "" ? "" : message}</h1>
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Register;
