import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to My App</h1>
      <div className="button-container">
        <button className="login-button">
          <Link to="/login">Login</Link>
        </button>
        <button className="register-button">
          <Link to="/register">Register</Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
