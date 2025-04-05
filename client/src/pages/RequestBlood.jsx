import React, { useEffect, useState } from "react";
import axios from "axios";

const RequestBlood = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [location, setLocation] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.log("Location error:", error.message);
        }
      );
    }
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();

    try {
      // Either use the response variable or remove it
      // const response = await axios.post(
      // If you need the response but aren't using it yet, you can comment it:
      /* const response = */ await axios.post(
        "http://localhost:5000/api/blood-requests",
        { bloodGroup, units, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Blood request submitted!");
      setBloodGroup("");
      setUnits("");
    } catch (error) {
      console.error("Error requesting blood:", error);
      alert("Failed to submit request");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-red-700 text-center">
        Request Blood
      </h2>
      <form onSubmit={handleRequest} className="space-y-4">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <input
          type="number"
          min="1"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          placeholder="Enter number of units"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Fetching location..."
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestBlood;
