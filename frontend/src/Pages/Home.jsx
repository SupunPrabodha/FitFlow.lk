import React, { useContext, useState } from 'react';
import Hero from '../components/Hero';
import FeedbackSlides from '../components/FeedbackSlides';
import { FeedbackContext } from '../context/FeedbackContext';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const { feedbacks } = useContext(FeedbackContext);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('descending');

  const features = [
    {
      image: "https://cdn-icons-png.flaticon.com/512/1198/1198314.png",
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
      image: "https://cdn-icons-png.flaticon.com/512/2964/2964514.png",
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
      image: "https://cdn-icons-png.flaticon.com/512/1087/1087840.png",
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
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
      title: 'Pro Shop',
      description: 'Our on-site store offers premium supplements, apparel, and accessories.',
      details: [
        'Protein & supplements',
        'Workout gear & apparel',
        'Fitness accessories',
        'Exclusive member discounts'
      ]
    }
  ];

  const fitnessTips = [
    {
      image: "https://cdn-icons-png.flaticon.com/512/2936/2936886.png",
      title: 'Progressive Overload',
      tips: [
        'Increase weight gradually (2-5% weekly)',
        'Add 1 rep each session when plateaued',
        'Reduce rest periods between sets',
        'Increase training volume methodically'
      ]
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/3502/3502601.png",
      title: 'Workout Timing',
      tips: [
        'Train at consistent times daily',
        'Morning workouts boost metabolism',
        'Allow 48hrs between muscle groups',
        'Keep sessions under 90 minutes'
      ]
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png",
      title: 'Nutrition Essentials',
      tips: [
        '1g protein per pound of body weight',
        'Hydrate with 0.5-1oz water per pound',
        'Time carbs around workouts',
        'Don\'t fear healthy fats'
      ]
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/865/865813.png",
      title: 'Recovery Matters',
      tips: [
        'Aim for 7-9 hours of sleep',
        'Active recovery days boost circulation',
        'Stretch post-workout, not cold',
        'Try foam rolling for muscle recovery'
      ]
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/1491/1491214.png",
      title: 'Mind-Muscle Connection',
      tips: [
        'Visualize muscles working',
        'Control both lifting and lowering',
        'Focus on form over weight',
        'Breathe properly during lifts'
      ]
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/1584/1584831.png",
      title: 'Track Progress',
      tips: [
        'Log workouts and nutrition',
        'Take monthly progress photos',
        'Measure strength gains',
        'Celebrate non-scale victories'
      ]
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
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
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors duration-300 h-full flex flex-col"
              >
                <div className="flex justify-center mb-4">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-16 h-16 object-contain filter invert"
                  />
                </div>
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

      {/* Fitness Tips Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">FITNESS TIPS</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            <p className="text-xl mt-6 max-w-3xl mx-auto text-gray-300">
              Expert advice to help you maximize your workouts and achieve better results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {fitnessTips.map((tip, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors duration-300 h-full"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={tip.image} 
                    alt={tip.title}
                    className="w-10 h-10 object-contain filter invert mr-3"
                  />
                  <h3 className="text-xl font-bold text-white">{tip.title}</h3>
                </div>
                <ul className="space-y-3">
                  {tip.tips.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2"></span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/blog" 
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              VIEW MORE FITNESS TIPS
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
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
                  'Basic Equipment Orientation',
                  'Cardio Training',
                  '3 Days Free Personal Training',
                  'Costomized Nutrition Plans',
                  'Costomized Workout Plans'
                ],
                highlight: false
              },
              {
                name: '6 MONTH PACKAGE',
                price: 'Rs. 12000',
                
                features: [
                  'Gym Access', 
                  'Locker Room', 
                  'Free WiFi',
                  'Basic Equipment Orientation',
                  'Cardio Training',
                  '3 Days Free Personal Training',
                  'Costomized Nutrition Plans',
                  'Costomized Workout Plans'
                ],
                highlight: true
              },
              {
                name: 'ANNUAL PLAN',
                price: 'Rs. 22000',
               
                features: [
                  'Gym Access', 
                  'Locker Room', 
                  'Free WiFi',
                  'Basic Equipment Orientation',
                  'Cardio Training',
                  '3 Days Free Personal Training',
                  'Costomized Nutrition Plans',
                  'Costomized Workout Plans'
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
                    <span className="text-gray-400">{plan.period}</span>
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

      {/* Feedback Section - Now fully visible */}
      <section className="py-20 bg-gray-900 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">WHAT OUR MEMBERS SAY</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4">
            <FeedbackSlides 
              feedbacks={feedbacks}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              ratingFilter="highRating"
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
          
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate('/feedback')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              VIEW ALL FEEDBACKS
            </button>
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
    </div>
  );
}

export default Home;