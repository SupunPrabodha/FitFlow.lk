import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const AboutPage = () => {
  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-6">About FitFlow Gym</h2>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Welcome to FitFlow!</h3>
          <p className="text-lg text-gray-300">
            At <strong>FitFlow</strong>, we believe that fitness is a journey, not a destination. Our mission is to create a supportive and dynamic environment where individuals of all fitness levels can thrive. Whether you're a beginner or a seasoned athlete, our team of experts is here to guide you every step of the way.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Who We Are</h3>
          <p className="text-lg text-gray-300">
            FitFlow Gym is more than just a fitness center; it's a community of like-minded individuals who are passionate about achieving their personal health and wellness goals. Founded by a group of fitness enthusiasts, FitFlow is committed to providing the best in fitness equipment, expert training, and a motivating atmosphere that inspires you to reach your full potential.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Our Philosophy</h3>
          <p className="text-lg text-gray-300">
            We believe that fitness should be accessible to everyone. Our philosophy revolves around <strong>balance</strong>, <strong>empowerment</strong>, and <strong>progress</strong>. We want to help you find your flow—whether it's through weight training, yoga, cardio, or group classes. Our expert trainers are dedicated to offering personalized support, ensuring you get the most out of your workouts.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Our Services</h3>
          <ul className="list-disc list-inside text-lg text-gray-300">
            <li><strong>Personal Training</strong>: Customized workout plans tailored to your fitness goals.</li>
            <li><strong>Group Classes</strong>: Fun and engaging group workouts, from HIIT to yoga.</li>
            <li><strong>Nutrition Coaching</strong>: Expert guidance on fueling your body for success.</li>
            <li><strong>Recovery & Wellness</strong>: Services to help your body heal and rejuvenate, like massage therapy and stretching classes.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Why Choose FitFlow?</h3>
          <ul className="list-disc list-inside text-lg text-gray-300">
            <li><strong>State-of-the-Art Equipment</strong>: Latest fitness equipment and technology for effective and safe workouts.</li>
            <li><strong>Experienced Trainers</strong>: Certified professionals who are passionate about your success.</li>
            <li><strong>Supportive Community</strong>: Be part of a motivating community of fitness enthusiasts.</li>
            <li><strong>Flexible Membership Plans</strong>: Membership options to suit your needs, whether short-term or long-term.</li>
          </ul>
        </section>

        <section className="text-center">
          <p className="text-lg text-gray-300 mb-4">At FitFlow, we’re committed to helping you live a healthier, stronger, and more fulfilled life. Join us today and be a part of our fitness community!</p>
          <Link to="/signup" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
            Join Us Now
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
