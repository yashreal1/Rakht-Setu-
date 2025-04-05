import React from "react";

const Contact = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-red-900">
      <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
      <p>
        Email us at{" "}
        <a
          href="mailto:lifebridge@support.com"
          className="text-red-700 underline"
        >
          lifebridge@support.com
        </a>
      </p>
    </div>
  );
};

export default Contact;
