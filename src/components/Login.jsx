/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Header from "./Header";
import { useState, useRef } from "react";
import { checkValidData } from "../assets/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../assets/firebase";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, seterrorMessage] = useState(null);
  const Navigate = useNavigate();
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    //validate the form data
    //console.log(email.current.value);
    // console.log(password.current.value);
    const msg = checkValidData(email.current.value, password.current.value);
    seterrorMessage(msg);
    // console.log(msg);

    if (msg) return;

    if (!isSignInForm) {
      //signup logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          Navigate("/browse");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          seterrorMessage(errorCode + "_" + errorMessage);
        });
    } else {
      //signin logic
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          Navigate("/browse");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          seterrorMessage(errorCode + "_" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://assets.nflxext.com/ffe/siteui/vlv3/638e9299-0637-42d1-ba39-54ade4cf2bf6/web/IN-en-20250203-TRIFECTA-perspective_46eb8857-face-4ea6-b901-dbf22b461369_large.jpg"
        alt="background"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black"></div>
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative z-10 left-145 top-40 ">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="pt-8 pl-6 bg-black rounded w-90 h-90"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <h2 className="text-amber-50 text-3xl font-bold mb-7">
            {isSignInForm ? "Sign in" : "Sign up"}
          </h2>
          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-4 mb-4 w-80 bg-gray-700 text-white  border-amber-50 border-1"
            />
          )}

          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="p-4 mb-4 w-80 bg-gray-700 text-white  border-amber-50 border-1"
          />

          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-4 mb-4 w-80  bg-gray-700 text-white rounded  border-amber-50 border-1"
          />
          <p className="text-red-500">{errorMessage}</p>
          <button
            className="p-3 w-80 bg-red-600 text-white rounded-lg"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign in" : "Sign up"}
          </button>
          <p className="text-amber-50 py-4" onClick={toggleSignInForm}>
            {isSignInForm
              ? "New to Netflix? Sign up Now"
              : "Already registerd ? Sign in Now"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
