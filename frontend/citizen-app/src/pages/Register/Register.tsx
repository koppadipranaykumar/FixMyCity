import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          fullName,
          email,
          phone,
          password,
        }
      );

      setMessage(response.data);

      if (
        response.data ===
        "Registration Successful"
      ) {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setMessage("Registration Failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <p className="bottom-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;