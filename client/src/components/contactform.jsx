import React, { useState } from "react";

export default function ContactForm({ onClose }) {
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("contactName:", contactName, "contactEmail:", contactEmail);

        // TODO: send the data to backend here

        onClose(); 
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-4">
            <h2 className="text-xl font-bold mb-4 text-center">Enter Emergency Contact</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter name"
                        className="border rounded w-full p-2"
                        required
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Enter email"
                        className="border rounded w-full p-2"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}