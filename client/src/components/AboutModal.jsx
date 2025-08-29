import React from "react";

export default function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💜</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              About CareLink
            </h2>
            <p className="text-purple-600 text-sm">Your mental wellness companion</p>
          </div>

          <div className="space-y-6">
            {/* Project Purpose */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                <span className="text-xl mr-2">🎯</span>
                Project Purpose
              </h3>
              <p className="text-gray-700 leading-relaxed">
                CareLink is designed to support your mental wellness journey through daily check-ins, 
                mood tracking, and emergency contact management. Our goal is to provide a safe, 
                private space for you to reflect on your emotional well-being and build healthy habits.
              </p>
            </div>

            {/* How to Use */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                <span className="text-xl mr-2">📖</span>
                How to Use CareLink
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Daily Check-In</h4>
                    <p className="text-gray-600 text-sm">Complete your daily mood and reflection check-in to track your emotional patterns over time.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Emergency Contacts</h4>
                    <p className="text-gray-600 text-sm">Add trusted contacts who can support you during difficult times. When your mood is down for more than a couple days, they will get a notification to check up on you.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Mood Calendar</h4>
                    <p className="text-gray-600 text-sm">View your mood history and identify patterns to better understand your emotional well-being.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Safety */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                <span className="text-xl mr-2">🔒</span>
                Privacy & Safety
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your data is stored securely and privately. CareLink is designed to be a personal tool 
                for your mental wellness journey. Remember, this is not a substitute for professional 
                mental health care.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Got it! Let's get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
