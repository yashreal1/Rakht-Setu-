import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Donor',
      image: (
        <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-8-4a4 4 0 11-8 0 4 4 0 018 0zm-8 8c0-2.667 5.333-4 8-4s8 1.333 8 4v2H8v-2z" />
        </svg>
      ),
      quote: "Donating blood through Life Bridge has been an incredibly rewarding experience. The process is smooth, and knowing I'm helping save lives keeps me coming back.",
    },
    {
      name: 'Michael Chen',
      role: 'Blood Recipient',
      image: (
        <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-8-4a4 4 0 11-8 0 4 4 0 018 0zm-8 8c0-2.667 5.333-4 8-4s8 1.333 8 4v2H8v-2z" />
        </svg>
      ),
      quote: "Life Bridge connected me with donors when I needed blood urgently. I'm forever grateful for this platform and the generous donors who saved my life.",
    },
    {
      name: 'Emily Rodriguez',
      role: 'Hospital Partner',
      image: (
        <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-8-4a4 4 0 11-8 0 4 4 0 018 0zm-8 8c0-2.667 5.333-4 8-4s8 1.333 8 4v2H8v-2z" />
        </svg>
      ),
      quote: "The efficiency and reliability of Life Bridge has significantly improved our blood supply management. It's a vital platform for our healthcare system.",
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold tracking-wide text-red-600 uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight leading-8 text-gray-900 sm:text-4xl lg:mx-auto lg:max-w-3xl">
            What People Are Saying
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto lg:text-center">
            Hear from donors, recipients, and healthcare partners about their experiences with Life Bridge.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="relative p-8 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                  <div className="flex justify-center items-center w-12 h-12 bg-red-50 rounded-full">
                    {testimonial.image}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-gray-600">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;