import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const ContactPage = () => {
  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-6">Contact Us</h2>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Get in Touch</h3>
          <p className="text-lg text-gray-300">
            We’d love to hear from you! Whether you have a question about our services, need help with your fitness journey, or just want to say hello, we’re here for you. Feel free to reach out through the following methods:
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Our Location</h3>
          <p className="text-lg text-gray-300">
            <strong>FitFlow Gym</strong>
            <br />
            123 Fitness Lane, Healthy City, 45678
            <br />
            <span className="text-red-500">Open 7 Days a Week: 6 AM - 10 PM</span>
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Email Us</h3>
          <p className="text-lg text-gray-300">
            You can email us anytime at: <a href="mailto:info@fitflow.com" className="text-red-500">info@fitflow.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Call Us</h3>
          <p className="text-lg text-gray-300">
            For immediate assistance, give us a call at: <span className="text-red-500">(123) 456-7890</span>
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Follow Us</h3>
          <p className="text-lg text-gray-300">
            Stay connected and follow us on social media for updates, tips, and motivation:
          </p>
          <div className="flex space-x-4 mt-4">
            <Link to="#" className="text-red-500 hover:text-red-600">
              <i className="fab fa-facebook-square fa-2x"></i>
            </Link>
            <Link to="#" className="text-red-500 hover:text-red-600">
              <i className="fab fa-instagram fa-2x"></i>
            </Link>
            <Link to="#" className="text-red-500 hover:text-red-600">
              <i className="fab fa-twitter-square fa-2x"></i>
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Send Us a Message</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg text-gray-300">Your Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg text-gray-300">Your Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg text-gray-300">Your Message</label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none"
                placeholder="Type your message here"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
            >
              Send Message
            </button>
          </form>
        </section>

        <section className="text-center">
          <Link to="/" className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">
            Back to Home
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
