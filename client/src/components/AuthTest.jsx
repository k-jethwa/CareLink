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
    <div className="card max-w-md mx-auto fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🧪</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Firebase Auth Test
        </h2>
        <p className="text-purple-600 text-sm mt-1">Test authentication functionality</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field border-purple-200 focus:border-purple-400 focus:ring-purple-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field border-purple-200 focus:border-purple-400 focus:ring-purple-100"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSignUp}
            className="btn-primary flex-1"
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            className="btn-secondary flex-1"
          >
            Sign In
          </button>
        </div>

        {message && (
          <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
            <p className="text-center text-green-700 text-sm">{message}</p>
          </div>
        )}

        {/* Tailwind test box */}
        <div className="p-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl text-center font-medium">
          ✨ Tailwind is working perfectly! ✨
        </div>
      </div>
    </div>
  );
}