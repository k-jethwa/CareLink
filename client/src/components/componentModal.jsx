import React from "react";
import ContactForm from "./contactform";

export default function EmergencyContactModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <ContactForm onClose={onClose} />
      </div>
    </div>
  );
}