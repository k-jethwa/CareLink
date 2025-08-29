import React, { useState } from "react";
import { auth } from "../components/firebase";

export default function ComponentModal2({ onClose }) {
  const [formData, setFormData] = useState({
    mood: 5,
    sleep: 8,
    reflections: "",
    hours_of_sleep: 8
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const token = await user.getIdToken(true);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Prepare data for backend
      const checkInData = {
        date: today,
        journal: formData.reflections, // Backend expects 'journal', not 'reflections'
        answers: {
          mood_rating: formData.mood,
          sleep_quality: formData.sleep,
        },
        hours_of_sleep: formData.hours_of_sleep
      };

      console.log("Submitting check-in data:", checkInData);

      const response = await fetch('http://127.0.0.1:5001/api/checkin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInData)
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Check-in successful:", result);

      // Successfully submitted - close modal and notify parent
      onClose();
      
    } catch (err) {
      console.error("Error submitting check-in:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-pink-700 mb-2">Daily Check-In</h2>
            <p className="text-pink-600 text-sm">How are you feeling today?</p>
          </div>
    
          <div className="space-y-6">
            {/* Mood Slider */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-pink-700">
                Mood: <span className="font-semibold text-pink-600">{formData.mood}/10</span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: Number(e.target.value) }))}
                  className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(formData.mood - 1) * 11.11}%, #f3e8ff ${(formData.mood - 1) * 11.11}%, #f3e8ff 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-pink-600 mt-1">
                  <span>😔</span>
                  <span>😐</span>
                  <span>😊</span>
                </div>
              </div>
            </div>

            {/* Sleep Slider */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-pink-700">
                Sleep Quality: <span className="font-semibold text-pink-600">{formData.sleep}/10</span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.sleep}
                  onChange={(e) => setFormData(prev => ({ ...prev, sleep: Number(e.target.value) }))}
                  className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${formData.sleep * 10}%, #f3e8ff ${formData.sleep * 10}%, #f3e8ff 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-pink-600 mt-1">
                  <span>😴</span>
                  <span>😐</span>
                  <span>😌</span>
                </div>
              </div>
            </div>
    
            {/* Hours of Sleep */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Hours of Sleep Last Night
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.hours_of_sleep}
                onChange={(e) => setFormData(prev => ({ ...prev, hours_of_sleep: Number(e.target.value) }))}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all duration-200 bg-white"
                placeholder="How many hours did you sleep?"
              />
            </div>

            {/* Journal Entry */}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                How are you feeling today? (Journal Entry)
              </label>
              <textarea
                value={formData.reflections}
                onChange={(e) => setFormData(prev => ({ ...prev, reflections: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all duration-200 bg-white resize-none"
                rows={4}
                placeholder="Write about your day, feelings, or anything on your mind..."
                required
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.reflections.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Check-In'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}