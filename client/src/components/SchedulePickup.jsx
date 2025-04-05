import React, { useState } from 'react';

const SchedulePickup = ({ request, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.date && formData.time;
      case 2:
        return formData.location;
      default:
        return false;
    }
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/30">
      <div className="p-6 w-full max-w-md bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Schedule Blood Donation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="form-label">Select Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="form-label">Pickup Location</label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Enter your complete address"
                required
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepComplete()}
                className="px-4 py-2 ml-auto text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepComplete()}
                className="px-4 py-2 ml-auto text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Pickup
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulePickup;