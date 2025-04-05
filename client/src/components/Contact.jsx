import React from 'react';

const Contact = () => {
  return (
    <div className="py-24 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold tracking-wide text-red-600 uppercase">GET IN TOUCH</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight leading-8 text-gray-900 sm:text-4xl">
            We're here to help you connect.
          </p>
        </div>

        <div className="mt-16 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-1">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent"
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                  required
                />
                <label htmlFor="consent" className="block ml-2 text-sm text-gray-700">
                  I allow this website to store my submission so they can respond to my inquiry. <span className="text-red-600">*</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-4 py-3 w-full text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                SUBMIT
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="mt-12 lg:mt-0 lg:col-span-1">
            <div className="p-8 bg-gray-50 rounded-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-900">Get in touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="ml-3 text-gray-700">+91123456789</span>
                </div>

                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-3 text-gray-700">lakshyac99@gmail.com</span>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="ml-3 text-gray-700">Greater Noida, UP IN</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Hours</h4>
                <div className="space-y-2">
                  {[
                    { day: 'Monday', hours: '9:00am - 10:00pm' },
                    { day: 'Tuesday', hours: '9:00am - 10:00pm' },
                    { day: 'Wednesday', hours: '9:00am - 10:00pm' },
                    { day: 'Thursday', hours: '9:00am - 10:00pm' },
                    { day: 'Friday', hours: '9:00am - 10:00pm' },
                    { day: 'Saturday', hours: '9:00am - 6:00pm' },
                    { day: 'Sunday', hours: '9:00am - 12:00pm' },
                  ].map((schedule) => (
                    <div key={schedule.day} className="flex justify-between text-gray-700">
                      <span>{schedule.day}</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;