import React from "react";
import { Link } from "react-router-dom";

const Trainers = () => {
  // Trainer data
  const trainers = [
    {
      id: 1,
      name: "Alex Johnson",
      specialization: "Strength Training",
      bio: "Certified strength coach with 10+ years experience helping athletes reach peak performance.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      certifications: ["NASM", "ACE", "CrossFit L3"]
    },
    {
      id: 2,
      name: "Sarah Williams",
      specialization: "Yoga & Mobility",
      bio: "Yoga therapist specializing in injury prevention and functional movement patterns.",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      certifications: ["RYT 500", "Yoga Medicine", "Fascia Training"]
    },
    {
      id: 3,
      name: "Mike Chen",
      specialization: "Olympic Weightlifting",
      bio: "Former competitive weightlifter now coaching national-level athletes.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      certifications: ["USAW L2", "Precision Nutrition L1", "FRCms"]
    },
    {
      id: 4,
      name: "Jamal Rodriguez",
      specialization: "Functional Fitness",
      bio: "Specializes in helping clients move better for everyday life and sports performance.",
      image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
      certifications: ["NASM CPT", "FMS", "TRX"]
    },
    {
      id: 5,
      name: "Elena Petrov",
      specialization: "Endurance Training",
      bio: "Marathon coach with a scientific approach to cardiovascular conditioning.",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      certifications: ["USATF", "UESCA", "EXOS"]
    },
    {
      id: 6,
      name: "Tyler Nguyen",
      specialization: "Rehabilitation",
      bio: "Physical therapist bridging the gap between rehab and performance training.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      certifications: ["DPT", "SCS", "SFMA"]
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center px-4"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
        }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
            MEET OUR TRAINERS
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Certified professionals dedicated to your fitness success
          </p>
        </div>
      </div>

      {/* Trainers Content */}
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">OUR TRAINING TEAM</h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Each FitFlow trainer brings unique expertise and a passion for helping clients achieve 
            their goals. Whether you're recovering from injury, training for competition, or just 
            starting your fitness journey, we have the perfect coach for you.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500 transition-colors duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={trainer.image} 
                  alt={trainer.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-1">{trainer.name}</h3>
                <p className="text-orange-500 font-medium mb-3">{trainer.specialization}</p>
                <p className="text-gray-400 mb-4">{trainer.bio}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">CERTIFICATIONS:</h4>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, index) => (
                      <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link 
                    to={`/trainers/${trainer.id}`} 
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded text-center transition-colors duration-200"
                  >
                    View Profile
                  </Link>
                  <Link 
                    to="/contact" 
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-center transition-colors duration-200"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Training Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">TRAINING PROGRAMS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "1-on-1 Coaching", 
                description: "Personalized training tailored to your specific goals and needs",
                price: "$99/session"
              },
              { 
                title: "Small Group Training", 
                description: "Get the benefits of personal training in a small group setting",
                price: "$45/session"
              },
              { 
                title: "Online Coaching", 
                description: "Remote programming and video consultations with your trainer",
                price: "$199/month"
              }
            ].map((program, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{program.title}</h3>
                <p className="text-gray-300 mb-4">{program.description}</p>
                <p className="text-orange-500 font-bold">{program.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-800 rounded-lg p-8 md:p-10 text-center border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">READY TO START TRAINING?</h3>
          <p className="mb-6 max-w-2xl mx-auto">Schedule a free consultation with one of our trainers today!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              BOOK CONSULTATION
            </Link>
            <Link 
              to="/membership" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              VIEW MEMBERSHIPS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;