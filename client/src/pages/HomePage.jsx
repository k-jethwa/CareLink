import React, { useEffect, useState } from "react";
import { auth } from "../components/firebase"; // import auth
import { getProtectedData } from "../api/journalApi";
import Banner from "../components/Banner";
import QuoteRotation from "../components/QuoteRotation";
import ComponentModal from "../components/componentModal";   // emergency contact modal
import ComponentModal2 from "../components/componentModal2"; // check in modal
import MoodCalendar from "../components/calendar";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState("Friend");
  const [showModal2, setShowModal2] = useState(false); 
  const [showContactForm, setContactForm] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserName(user?.displayName || "Friend");
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getProtectedData();
        setData(result);
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    }
    fetchData();
  }, []);

  console.log("Rendering HomePage with userName:", userName);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Banner */}
      <Banner userName={userName} />
      <QuoteRotation />

      {/* Daily Check-In Button */}
      <div className="text-center">
        <button
          onClick={() => setShowModal2(!showModal2)}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 transition"
        >
          {showModal2 ? "Close Daily Check-In" : "Open Daily Check-In"}
        </button>
      </div>

      {/* Daily Check-In Modal */}
      {showModal2 && (
        <ComponentModal2 onClose={() => setShowModal2(false)} />
      )}

      {/* Emergency Contact Button */}
      <div className="text-center mt-4">
        <button
          onClick={() => setContactForm(true)}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Enter Emergency Contact
        </button>
      </div>

      {/* Emergency Contact Modal */}
      {showContactForm && (
        <ComponentModal onClose={() => setContactForm(false)} />
      )}
      <div className="mt-8">
        <MoodCalendar />
      </div>
    </div>
  );
}