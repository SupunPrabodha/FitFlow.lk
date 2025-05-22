import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ViewTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trainer/list');
        const data = await response.json();
        if (data.success) {
          setTrainers(data.trainers);
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">OUR EXPERT TRAINERS</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="text-xl mt-6 max-w-3xl mx-auto text-gray-300">
            Meet our team of certified fitness professionals dedicated to helping you achieve your goals.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading trainers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {trainers.map((trainer) => (
              <div key={trainer._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-orange-500">
                    {trainer.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                    <p className="text-orange-500">{trainer.qualification}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    <span className="text-white font-medium">Email:</span> {trainer.email}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-medium">Age:</span> {trainer.age}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-medium">Contact:</span> {trainer.contact}
                  </p>
                </div>
                <Link 
                  to={`/trainer/${trainer._id}`}
                  className="mt-4 inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTrainers; 