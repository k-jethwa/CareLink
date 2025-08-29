import React from "react";
import CheckInForm from "./checkinform";

export default function ComponentModal2({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CheckInForm onClose={onClose} />
      </div>
    </div>
  );
}