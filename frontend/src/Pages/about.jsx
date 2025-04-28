import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      {/* Hero Section with Reduced Height */}
      <div 
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center px-4"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
        }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
            F I T F L O W . L K
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Transform your body, elevate your mind
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            JOIN NOW
          </Link>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">OUR STORY</h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Founded in 2000, FITFLOW GYM has grown from a small local fitness center to a premier training facility. 
            Our mission is to provide world-class equipment, expert coaching, and a supportive community to help 
            you achieve lasting results.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { number: "1000+", label: "Members" },
            { number: "15+", label: "Certified Trainers" },
            { number: "24/7", label: "Availability" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700 hover:border-orange-500 transition-colors"
            >
              <p className="text-4xl font-bold text-orange-500 mb-2">{stat.number}</p>
              <p className="text-xl">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-16">
  <h2 className="text-3xl font-bold text-white mb-8">WHY CHOOSE US</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      { 
        image: "https://cdn-icons-png.flaticon.com/512/3565/3565418.png", // trainer icon
        title: "Expert Trainers", 
        description: "Our certified professionals create personalized programs for all fitness levels." 
      },
      { 
        image: "https://cdn-icons-png.flaticon.com/512/3565/3565432.png", // equipment icon
        title: "Premium Equipment", 
        description: "State-of-the-art machines from leading fitness brands." 
      },
      { 
        image: "https://cdn-icons-png.flaticon.com/512/3565/3565477.png", // holistic icon
        title: "Holistic Approach", 
        description: "We focus on physical, mental, and nutritional wellness." 
      }
    ].map((feature, index) => (
      <div 
        key={index} 
        className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors"
      >
        <img 
          src={feature.image} 
          alt={feature.title}
          className="w-16 h-16 mx-auto mb-4 object-contain"
        />
        <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
        <p className="text-gray-300">{feature.description}</p>
      </div>
    ))}
  </div>
</div>

        {/* Gallery Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">OUR FACILITY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
              "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
              "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
              "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            ].map((imageUrl, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <img 
                  src={imageUrl} 
                  alt="Gym facility" 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-800 rounded-lg p-8 md:p-10 text-center border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">READY TO START YOUR JOURNEY?</h3>
          <p className="mb-6 max-w-2xl mx-auto">Join our community today and get your first week free!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              SIGN UP NOW
            </Link>
            <Link 
              to="/contact" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;