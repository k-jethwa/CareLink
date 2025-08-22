import React from "react";

export default function Banner({userName}) {
  return (
    <div className="bg-pink-400 text-pink-800 p-6 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold">Hello, {userName}!</h1>


    </div>
  );

}