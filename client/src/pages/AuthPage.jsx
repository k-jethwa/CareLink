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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card max-w-md w-full mx-auto fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-responsive-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome to CareLink
                    </h1>
                    <p className="text-pink-600 text-sm">Your mental wellness journey starts here</p>
                </div>
        
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-pink-700 mb-2">Name (signup only)</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-pink-700 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-pink-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>
        
                    <div className="space-y-3">
                        <button
                            onClick={handleSignUp}
                            className="btn-primary w-full"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={handleSignIn}
                            className="btn-secondary w-full"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-pink-500 text-sm">
                        Join our community of mental wellness advocates
                    </p>
                </div>
            </div>
        </div>
    );
}
