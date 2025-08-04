import { useState } from "react";
import {
  auth,
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "./firebase";
import "../login/authPage.css"
import { useNavigate } from "react-router-dom";


const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(""); // New error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (email === "" || password === "") {
      setError("Please enter both email and password.");
      return;
    }

    //   try {
    //     await createUserWithEmailAndPassword(auth, email, password);
    //     alert("User signup successfully!")
    //     console.log("User signed up!");
    //     actionDone(); // Navigate only on success
    //   } catch (error) {
    //     setError(error.message);
    //   }
    // } 
    else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in!");
        alert("Admin signin successfully!")
        actionDone(); // Navigate only on success
      } catch (error) {
        setError("Invalid email or password! Please try again." + error); // Show error message
      }
    }
  };

  const actionDone = () => {
    setTimeout(() => {
      // console.log("Navigating to Onboarding-page");
      navigate("/Admin");
    }, 500);
  };

  return (
    <div className="email-Container">

      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="enterEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <br />
        <input
          className="enterEmail"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br />
        <button className="button" id="signin" type="submit">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
<br />
      {/* Show error message if authentication fails */}
      {error && <p className="showError" style={{ color: "red" }}>{error}</p>}
<br />
      {/* <button
        className="button"
        id="signup"
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError(""); // Clear error when switching forms
        }}
        >
        Switch to {isSignUp ? "Sign In" : "Sign Up"}
      </button> */}
        </form>
    </div>
  );
};

export default AuthPage;
