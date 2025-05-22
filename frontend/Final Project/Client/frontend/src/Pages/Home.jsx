import React, { useContext, useState, useEffect } from 'react';
import Hero from '../Components/Hero';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

function Home() {
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
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <Navbar/>
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">WHY CHOOSE</h2>
            <h2 className='text-3xl md:text-4xl font-bold text-orange-600 mb-4'>FITFLOW.LK</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            <p className="text-xl mt-6 max-w-3xl mx-auto text-gray-300">
              We offer comprehensive fitness solutions to help you achieve your goals with expert guidance and premium facilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '💪',
                title: 'Personal Trainers',
                description: 'Certified trainers create customized workout plans tailored to your goals.',
                details: [
                  'Initial fitness assessment',
                  'Personalized workout plans',
                  'Form correction',
                  'Motivation & accountability'
                ]
              },
              {
                icon: '📋',
                title: 'Workout Plans',
                description: 'Structured programs for all fitness levels with progressive overload principles.',
                details: [
                  'Strength training programs',
                  'Cardio routines',
                  'Flexibility/mobility plans',
                  'Sport-specific training'
                ]
              },
              {
                icon: '🥗',
                title: 'Nutrition Plans',
                description: 'Customized meal plans with macronutrient breakdowns and supplement guidance.',
                details: [
                  'Body composition analysis',
                  'Meal planning templates',
                  'Supplement recommendations',
                  'Weekly check-ins'
                ]
              },
              {
                icon: '🛒',
                title: 'Pro Shop',
                description: 'Our on-site store offers premium supplements, apparel, and accessories.',
                details: [
                  'Protein & supplements',
                  'Workout gear & apparel',
                  'Fitness accessories',
                  'Exclusive member discounts'
                ]
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors duration-300 h-full flex flex-col"
              >
                <span className="text-5xl block mb-4 text-center">{feature.icon}</span>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{feature.title}</h3>
                <p className="mb-4 text-center">{feature.description}</p>
                <ul className="mt-auto space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-20 bg-gray-800">
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
                <div key={trainer._id} className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-orange-500">
                      {trainer.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                      <p className="text-orange-500">{trainer.specialization}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">
                      <span className="text-white font-medium">Experience:</span> {trainer.experience} years
                    </p>
                    <p className="text-gray-400">
                      <span className="text-white font-medium">Certifications:</span> {trainer.certifications}
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
      </section>

      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">MEMBERSHIP PLANS</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            <p className="text-xl mt-6 max-w-3xl mx-auto text-gray-300">
              Choose the plan that fits your goals. All memberships include access to our premium facilities and expert staff.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: '3 MONTH PACKAGE',
                price: 'Rs. 7000',
                features: [
                  'Gym Access', 
                  'Locker Room', 
                  'Free WiFi',
                  'Basic Equipment Orientation'
                ],
                highlight: false
              },
              {
                name: '6 MONTH PACKAGE',
                price: 'Rs. 12000',
                features: [
                  'All Basic Features',
                  'Group Classes',
                  'Sauna Access',
                  '1 Free PT Session/Month',
                  'Nutrition Guide'
                ],
                highlight: true
              },
              {
                name: 'Elite',
                price: 'Rs. 22000',
                features: [
                  'All Premium Features',
                  'Unlimited PT Sessions',
                  'Customized Nutrition Plan',
                  '24/7 Access',
                  'Pro Shop Discounts'
                ],
                highlight: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-gray-900 p-8 rounded-xl border-2 ${plan.highlight ? 'border-orange-500 transform scale-105' : 'border-gray-700'} transition-all duration-300 h-full flex flex-col`}
              >
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-orange-500">{plan.price}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link 
                  to="/signup" 
                  className={`mt-auto text-center py-3 px-6 rounded-lg font-bold transition-colors duration-200 ${plan.highlight ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                >
                  JOIN NOW
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">READY TO TRANSFORM YOUR BODY?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join FOREVER GYM today and get your first week free plus a complimentary training session!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              SIGN UP NOW
            </Link>
            <Link 
              to="/contact" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              BOOK A TOUR
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

export default Home;