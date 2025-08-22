import React, { useState } from "react";
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Sign up successful!");
    } catch (error) {
      setMessage(`Sign up error: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Sign in successful!");
    } catch (error) {
      setMessage(`Sign in error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm mx-auto bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Firebase Auth Test</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      <div className="flex gap-2 justify-center">
        <button
          onClick={handleSignUp}
          className="bg-pink-400 text-white py-2 px-4 rounded hover:bg-pink-500 transition"
        >
          Sign Up
        </button>
        <button
          onClick={handleSignIn}
          className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
        >
          Sign In
        </button>
      </div>

      {message && <p className="text-center text-gray-700 mt-2">{message}</p>}

      {/* Tailwind test box */}
      <div className="bg-red-500 text-white p-4 rounded mt-4 text-center">
        Tailwind is working!
      </div>
    </div>
  );
}