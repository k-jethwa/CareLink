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
        <div className="p-8">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📞</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Emergency Contact</h2>
                <p className="text-blue-600 text-sm">Add someone you trust for support</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-blue-700">Contact Name</label>
                    <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter their full name"
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-white"
                        required
                    />
                </div>

                {/* Email Input */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-blue-700">Contact Email</label>
                    <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Enter their email address"
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-white"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-blue-300 text-blue-600 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Save Contact
                    </button>
                </div>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-blue-700 text-sm text-center">
                    💙 This contact will be available for emergency situations
                </p>
            </div>
        </div>
    );
}