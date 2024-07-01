import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CLIENT_ID =
  "716338759481-3t52ihgb9pa4ifk96mjnlehh8c0idr07.apps.googleusercontent.com";
//const clientSecret = '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';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email: emailFromLogin } = location.state || {};
  console.log(emailFromLogin);

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      const code = res.access_token;

      console.log(code, "Access token");
      try {
        console.log(emailFromLogin);
        await axios.post("http://localhost:3001/oauth2callback", {
          codes: code,
          email: emailFromLogin,
        });
        navigate("/contact", { state: { email: emailFromLogin } });
      } catch (error) {
        console.log(error);
      }
    },
    onFailure: (error) => {
      console.log("Error logging in with Google:", error);
    },
    flow: "implicit",
    scope: "https://www.googleapis.com/auth/contacts.readonly",
    clientId: CLIENT_ID,
    redirect_uri: "http://localhost:3000/login",
  });
  const handleClick = () => {
    console.log("i was clicked");
    console.log(emailFromLogin)
    navigate('/contact', { state: { emailFromLogin } });
  };
  return (
    <div className="list-group">
      <button
        onClick={handleClick}
        className="list-group-item list-group-item-action"
      >
        Friends
      </button>
      <Link to="#" className="list-group-item list-group-item-action">
        Groups
      </Link>
      <button
        className="list-group-item list-group-item-action"
        onClick={() => googleLogin()}
      >
        Sign in with Google to import your Contacts
      </button>
    </div>
  );
};

export default Login;
