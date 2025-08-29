import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/firebase";
import Banner from "../components/Banner";
import QuoteRotation from "../components/QuoteRotation";
import ComponentModal from "../components/componentModal"; // contact modal
import ComponentModal2 from "../components/componentModal2"; // check in modal
import MoodCalendar from "../components/calendar";

export default function HomePage() {
  const [showModal2, setShowModal2] = useState(false);
  const [showContactForm, setContactForm] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("User");

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setUserName(user.displayName || user.email || "User");
      }
    });
    return unsubscribe; // cleanup listener
  }, []);

  // Check if user has checked in today
  useEffect(() => {
    const lastCheckIn = localStorage.getItem('lastCheckIn');
    const today = new Date().toDateString();
    setHasCheckedInToday(lastCheckIn === today);
  }, []);

  // Handle check-in completion
  const handleCheckInComplete = () => {
    const today = new Date().toDateString();
    localStorage.setItem('lastCheckIn', today);
    setHasCheckedInToday(true);
    setShowModal2(false);
    
    // Force refresh the calendar to show the new check-in
    setRefreshKey(prev => prev + 1);
    
    console.log("Check-in completed, refreshing calendar with key:", refreshKey + 1);
  };
  

  console.log("Rendering HomePage with userName:", userName);

  return (
    <div className="space-y-6">
      {/* Banner and Quote - Reduced spacing */}
      <div className="space-y-4">
        <Banner userName={userName} />
        <QuoteRotation />
      </div>

      {/* Main Content Area - Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Action Panels */}
        <div className="lg:w-1/3 space-y-6">
          {/* Daily Check-In Panel */}
          <div className={`bg-white rounded-2xl shadow-lg border-2 p-6 text-center hover:shadow-xl transition-all duration-300 ${
            hasCheckedInToday 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200'
          }`}>
            <div className="mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
                hasCheckedInToday 
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-br from-pink-400 to-pink-500'
              }`}>
                <span className="text-2xl">
                  {hasCheckedInToday ? '✅' : '📝'}
                </span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                hasCheckedInToday ? 'text-green-700' : 'text-pink-700'
              }`}>
                Daily Check-In
              </h3>
              <p className={`text-sm ${
                hasCheckedInToday ? 'text-green-600' : 'text-pink-600'
              }`}>
                {hasCheckedInToday 
                  ? 'Great job! You\'ve completed today\'s check-in.' 
                  : 'Track your mood and reflections for today'
                }
              </p>
            </div>
            <button
              onClick={() => setShowModal2(!showModal2)}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                hasCheckedInToday 
                  ? 'border-2 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {hasCheckedInToday ? 'Update Check-In' : 'Start Daily Check-In'}
            </button>
          </div>

          {/* Emergency Contact Panel */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🆘</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">
                Emergency Contacts
              </h3>
              <p className="text-sm text-blue-600">
                Add trusted contacts for emergency situations
              </p>
            </div>
            <button
              onClick={() => setContactForm(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Manage Contacts
            </button>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-200 hover:shadow-xl transition-all duration-300">
            <MoodCalendar refreshKey={refreshKey} />
          </div>
        </div>
      </div>

      {/* Daily Check-In Modal */}
      {showModal2 && (
        <ComponentModal2 onClose={handleCheckInComplete} />
      )}

      {/* Emergency Contact Modal */}
      {showContactForm && (
        <ComponentModal onClose={() => setContactForm(false)} />
      )}
    </div>
  );
}