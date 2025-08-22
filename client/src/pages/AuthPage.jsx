import React, { useState } from "react";
import { auth } from "../components/firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSignUp = async () => {
        try {
            const UserCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = UserCredential.user;
            await updateProfile(user, { displayName: name});
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Welcome back!");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-6 max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-center">Hi!</h1>
    
          <input
            type="text"
            placeholder="Name (signup only)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded border"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded border"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded border"
          />
    
          <button
            onClick={handleSignUp}
            className="bg-pink-400 text-white py-2 rounded hover:bg-pink-500 transition"
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            className="bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition"
          >
            Sign In
          </button>
        </div>
      );
    }
