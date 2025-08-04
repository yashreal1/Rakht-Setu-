import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const RequestBlood = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [step, setStep] = useState(1);
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!token || !user) {
      setToast({
        show: true,
        message: "Please login to request blood",
        type: "error"
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [token, user, navigate]);

  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)} (Please provide additional location details)`)
          } catch (error) {
            console.error("Error getting location details:", error);
            setLocationError("Please enter your location manually with specific details (e.g., Hospital name, Area, City)");
          }
        },
        (error) => {
          console.error("Location error:", error.message);
          setLocationError("Please enter your location manually with specific details (e.g., Hospital name, Area, City)");
        }
      );
    }
  }, []);

  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!bloodGroup || !units) {
        setToast({
          show: true,
          message: "Please fill in all required fields",
          type: "error"
        });
        return;
      }
    } else if (step === 2) {
      if (!location) {
        setToast({
          show: true,
          message: "Please provide your location",
          type: "error"
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields and user authentication
    const missingFields = [];
    if (!bloodGroup) missingFields.push('Blood Group');
    if (!units) missingFields.push('Units');
    if (!location) missingFields.push('Location');
    if (!user || !user._id) missingFields.push('User Authentication');

    if (missingFields.length > 0) {
      setToast({
        show: true,
        message: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        type: "error"
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/requests",
        { 
          bloodGroup, 
          units: parseInt(units), 
          location,
          urgency,
          notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setToast({
        show: true,
        message: "Blood request submitted successfully!",
        type: "success"
      });
      
      // Reset form
      setBloodGroup("");
      setUnits("");
      setLocation("");
      setUrgency("normal");
      setNotes("");
      setStep(1);
      
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Error requesting blood:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit request";
      setToast({
        show: true,
        message: errorMessage,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto mt-10 max-w-xl bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-primary-600">
        Request Blood
      </h2>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-primary-600' : 'text-gray-500'}`}>Blood Details</span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-primary-600' : 'text-gray-500'}`}>Location</span>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-primary-600' : 'text-gray-500'}`}>Additional Info</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-primary-600 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleRequest} className="space-y-6">
        {/* Step 1: Blood Details */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Blood Group <span className="text-red-500">*</span></label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="p-3 w-full rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
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
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Units Required <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                placeholder="Enter number of units"
                className="p-3 w-full rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Specify how many units of blood you need</p>
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                className="py-3 px-6 w-full text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-300 hover-lift"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={locationError || "Enter location (e.g., Hospital name, Area, City)"}
                className="p-3 w-full rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              {locationError && (
                <p className="mt-1 text-sm text-red-600">{locationError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Please provide specific details about where the blood is needed</p>
            </div>
            
            <div className="flex justify-between pt-4 space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="py-3 px-6 w-1/2 text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="py-3 px-6 w-1/2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-300 hover-lift"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Additional Information */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="p-3 w-full rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information that might be helpful..."
                className="p-3 w-full h-24 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
            
            <div className="flex justify-between pt-4 space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="py-3 px-6 w-1/2 text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="py-3 px-6 w-1/2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-300 hover-lift flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
      
      {/* Information panel */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Important Information</h3>
        <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
          <li>Your request will be visible to potential donors in your area</li>
          <li>You'll be notified when someone agrees to donate</li>
          <li>Please ensure all information provided is accurate</li>
          <li>For emergency situations, please also contact your nearest hospital directly</li>
        </ul>
      </div>
      
      {/* Toast notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({...toast, show: false})} 
        />
      )}
    </div>
  );
};

export default RequestBlood;
