import React from "react";
import CheckInForm from "./checkinform";

export default function ComponentModal2({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Render your Daily Check-In Form */}
        <CheckInForm />
      </div>
    </div>
  );
}