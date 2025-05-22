import p1 from "./p1.jpg";
import p2 from "./p2.jpg";
import p3 from "./p3.jpg";
import p4 from "./p4.jpg";
import p5 from "./p5.jpg";
import p6 from "./p6.jpg";
import p7 from "./p7.jpg";
import p8 from "./p8.jpg";
import p9 from "./p9.jpg";
import p10 from "./p10.jpg";
import p11 from "./p11.jpg";
import p12 from "./p12.jpg";
import logo from "./logo.png";
import search_icon from "./search_icon.jpg";
import exchange_icon from "./exchange_icon.jpg";
import quality_icon from "./quality_icon.jpg";
import star_icon from "./star_icon.png";
import cart_icon from "./cart_icon.jpg";
import stripe_icon from "./stripe_icon.jpg";
import razorpay_icon from "./razorpay_icon.jpg";
import bin_icon from "./bin_icon.jpg";

import service_icon from "./service_icon.jpg";

export const assets = {
  products: [
    { 
      _id: 1, 
      name: 'Premium Whey Protein', 
      price: 3499, 
      category: 'Supplements', 
      image: p1,
      description: '25g protein per serving with digestive enzymes for better absorption',
      bestSeller: true
    },
    { 
      _id: 2, 
      name: 'Yoga Mat', 
      price: 1299, 
      category: 'Essentials', 
      image: p2,
      description: '6mm thick non-slip eco-friendly mat for all yoga styles',
      bestSeller: true
    },
    {
      _id: 3,
      name: 'Adjustable Dumbbell Set',
      price: 5999,
      category: 'Supplements',
      image: p3,
      description: '5kg to 25kg adjustable weights in 2.5kg increments, compact design for home gyms',
      bestSeller: true
    },
    {
      _id: 4,
      name: 'Resistance Bands Set',
      price: 899,
      category: 'Essentials',
      image: p4,
      description: '5 multi-level resistance bands for full-body workouts'
    },
    {
      _id: 5,
      name: 'Foam Roller',
      price: 799,
      category: 'Recovery',
      image: p5,
      description: 'High-density foam roller for muscle recovery and flexibility'
    },
    {
      _id: 6,
      name: 'Jump Rope',
      price: 499,
      category: 'Cardio',
      image: p6,
      description: 'Weighted speed rope for cardio and coordination training'
    },
    {
      _id: 7,
      name: 'Kettlebell',
      price: 1299,
      category: 'Strength',
      image: p7,
      description: 'Cast iron kettlebell with ergonomic handle for versatile workouts',
      bestSeller: true
    },
    {
      _id: 8,
      name: 'Fitness Tracker',
      price: 2499,
      category: 'Accessories',
      image: p8,
      description: 'Waterproof activity tracker with heart rate monitoring'
    },
    {
      _id: 9,
      name: 'Yoga Blocks',
      price: 699,
      category: 'Yoga',
      image: p9,
      description: 'Pair of high-density foam yoga blocks for support and alignment'
    },
    {
      _id: 10,
      name: 'Workout Gloves',
      price: 599,
      category: 'Accessories',
      image: p10,
      description: 'Padded weightlifting gloves for better grip and protection'
    },
    {
      _id: 11,
      name: 'Hydration Pack',
      price: 1499,
      category: 'Essentials',
      image: p11,
      description: '2L hydration backpack with breathable straps for runners'
    },
    {
      _id: 12,
      name: 'Meditation Cushion',
      price: 899,
      category: 'Wellness',
      image: p12,
      description: 'Ergonomic zafu cushion for comfortable meditation sessions'
    }
  ],
  icons: {
    logo,
    search_icon,
    exchange_icon,
    quality_icon,
    star_icon,
    cart_icon,
    bin_icon,
    stripe_icon,
    razorpay_icon,
    service_icon
  }
};