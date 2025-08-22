import { auth } from "../components/firebase.js";

export async function getProtectedData() {
  if (!auth.currentUser) {
    throw new Error("No user is signed in");
  }

  const token = await auth.currentUser.getIdToken();
  const res = await fetch("http://127.0.0.1:5001/api/journal", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}