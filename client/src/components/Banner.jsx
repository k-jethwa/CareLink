import React from "react";

export default function Banner({userName}) {
  return (
    <div className="bg-gradient-to-r from-pink-100 via-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl shadow-lg text-center p-6">
      <div className="mb-3">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1">
          Hello, {userName}!
        </h1>
        <p className="text-pink-600 text-base">How are you feeling today?</p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <div className="flex items-center space-x-2 text-pink-600">
          <span className="text-xl">🌱</span>
          <span className="text-sm font-medium">Take care of yourself</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-600">
          <span className="text-xl">💜</span>
          <span className="text-sm font-medium">You're doing great</span>
        </div>
      </div>
    </div>
  );
}