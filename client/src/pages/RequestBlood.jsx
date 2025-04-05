import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const RequestBlood = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [location, setLocation] = useState("");
  const token = localStorage.getItem("token");
  const { user } = useAuth();

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

    // Validate required fields
    const missingFields = [];
    if (!bloodGroup) missingFields.push('Blood Group');
    if (!units) missingFields.push('Units');
    if (!location) missingFields.push('Location');

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/blood-requests",
        { 
          bloodGroup, 
          units: parseInt(units), 
          location,
          requestedBy: user._id // Add the requestedBy field
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Blood request submitted!");
      setBloodGroup("");
      setUnits("");
      setLocation("");
    } catch (error) {
      console.error("Error requesting blood:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit request";
      alert(errorMessage);
    }
  };

  return (
    <div className="p-6 mx-auto mt-10 max-w-md bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center text-red-700">
        Request Blood
      </h2>
      <form onSubmit={handleRequest} className="space-y-4">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="p-2 w-full rounded border"
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
          className="p-2 w-full rounded border"
          required
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Fetching location..."
          className="p-2 w-full rounded border"
          required
        />

        <button
          type="submit"
          className="py-2 w-full text-white bg-red-700 rounded hover:bg-red-800"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestBlood;
