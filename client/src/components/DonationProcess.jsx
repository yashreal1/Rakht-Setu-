import React from 'react';

const DonationProcess = () => {
  const steps = [
    {
      title: 'Registration',
      description: 'Fill out a simple form with your basic information and medical history.',
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Health Screening',
      description: "Quick health check to ensure you're eligible to donate blood safely.",
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Blood Donation',
      description: 'The actual donation process takes only 8-10 minutes.',
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      title: 'Recovery',
      description: 'Rest and enjoy refreshments while we monitor your recovery.',
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold tracking-wide text-red-600 uppercase">Simple Steps</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight leading-8 text-gray-900 sm:text-4xl lg:mx-auto lg:max-w-3xl">
            The Blood Donation Process
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto lg:text-center">
            Donating blood is a safe and simple process that takes less than an hour of your time.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex justify-center items-center mx-auto w-24 h-24 text-red-600 bg-red-50 rounded-full">
                  {step.icon}
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden absolute top-12 left-full w-24 h-1 bg-red-100 transform translate-x-4 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationProcess;