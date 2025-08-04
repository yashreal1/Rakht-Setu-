import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Donate = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [donationDate, setDonationDate] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !user) {
      setToast({
        show: true,
        message: 'Please login to proceed with donation',
        type: 'error'
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/requests/${requestId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setRequest(response.data);
      } catch (err) {
        setError('Failed to load request details');
        console.error('Error fetching request:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, token, user, navigate]);

  const handleDonateClick = () => {
    setShowConfirmation(true);
  };

  const handleCancelDonation = () => {
    setShowConfirmation(false);
  };

  const handleDonate = async () => {
    if (!donationDate) {
      setToast({
        show: true,
        message: 'Please select a donation date',
        type: 'error'
      });
      return;
    }

    setIsConfirming(true);
    try {
      await axios.post(
        `http://localhost:5000/api/requests/${requestId}/donate`,
        { donationDate },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setToast({
        show: true,
        message: 'Thank you for your willingness to donate! The requester will be notified.',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to process donation',
        type: 'error'
      });
    } finally {
      setIsConfirming(false);
    }
  };
  
  // Calculate minimum date (today) and maximum date (30 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      <p className="ml-3 text-primary-600 font-medium">Loading request details...</p>
    </div>
  );

  if (error) return (
    <div className="p-6 mx-auto mt-10 max-w-md bg-white rounded-lg shadow-lg text-center">
      <div className="p-4 mb-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
      <Link to="/dashboard" className="inline-block px-6 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-300">
        Return to Dashboard
      </Link>
    </div>
  );

  if (!request) return null;

  return (
    <div className="p-8 mx-auto mt-10 max-w-xl bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-primary-600">
        Blood Donation Request
      </h2>
      
      {/* Request details card */}
      <div className="mb-8 overflow-hidden bg-white rounded-lg shadow-md hover-lift">
        <div className="p-1 bg-gradient-to-r from-red-500 to-red-700"></div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex justify-center items-center w-12 h-12 mr-4 bg-red-50 rounded-full">
                <span className="text-2xl font-bold text-primary-600">{request.bloodGroup}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Blood Request #{requestId.substring(0, 6)}</h3>
                <p className="text-sm text-gray-500">Posted on {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {request.status || 'Active'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Request Details</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Blood Group:</span>
                  <span className="font-medium">{request.bloodGroup}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Units Needed:</span>
                  <span className="font-medium">{request.units}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Urgency:</span>
                  <span className="font-medium">{request.urgency || 'Normal'}</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Requester Info</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{request.requestedBy?.name || 'Anonymous'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Hospital:</span>
                  <span className="font-medium">{request.requestedBy?.hospital || 'Not specified'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium truncate max-w-[150px]" title={request.location}>{request.location}</span>
                </li>
              </ul>
            </div>
          </div>
          
          {request.notes && (
            <div className="p-4 mb-6 bg-blue-50 rounded-lg">
              <h4 className="mb-2 text-sm font-semibold text-blue-700">Additional Notes</h4>
              <p className="text-blue-600">{request.notes}</p>
            </div>
          )}
          
          {!showConfirmation ? (
            <div className="flex justify-center">
              <button
                onClick={handleDonateClick}
                className="px-6 py-3 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-300 hover-lift focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                I Want to Donate
              </button>
            </div>
          ) : (
            <div className="p-4 border border-gray-200 rounded-lg animate-fadeIn">
              <h4 className="mb-4 text-lg font-semibold text-center">Confirm Your Donation</h4>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">When can you donate?</label>
                <input 
                  type="date" 
                  value={donationDate}
                  onChange={(e) => setDonationDate(e.target.value)}
                  min={today}
                  max={maxDateStr}
                  className="p-3 w-full rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Select a date within the next 30 days</p>
              </div>
              
              <div className="flex justify-between space-x-4">
                <button
                  onClick={handleCancelDonation}
                  className="px-4 py-2 w-1/2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonate}
                  disabled={isConfirming}
                  className="px-4 py-2 w-1/2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-300 flex justify-center items-center"
                >
                  {isConfirming ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm Donation'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Information panel */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Important Information</h3>
        <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
          <li>You must be at least 18 years old and in good health to donate blood</li>
          <li>The donation process takes about 30-45 minutes</li>
          <li>Please bring a valid ID when you go to donate</li>
          <li>Eat well and stay hydrated before your donation</li>
        </ul>
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-800 transition-colors duration-300">
          ← Return to Dashboard
        </Link>
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

export default Donate;