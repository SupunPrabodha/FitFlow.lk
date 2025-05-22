import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `You are a knowledgeable fitness and nutrition assistant for FitFlow gym. 
Your role is to provide accurate, helpful advice about:
- Workout routines and exercises
- Nutrition and diet plans
- Fitness goals and progress tracking
- General health and wellness
- Gym equipment usage and safety

Keep responses concise, practical, and evidence-based. If asked about medical conditions or injuries, 
remind users to consult healthcare professionals. Always promote safe and healthy practices.`;

// Fallback responses for when OpenAI API is unavailable
const fallbackResponses = {
    workout: [
        "For a great workout, try 3 sets of 12 reps each: push-ups, squats, and planks.",
        "I recommend starting with 20 minutes of cardio followed by strength training.",
        "Remember to warm up properly before exercising and cool down afterward.",
        "Try this full-body workout: 10 burpees, 15 lunges per leg, 20 mountain climbers, 3 sets.",
        "For muscle building, focus on compound exercises like deadlifts, bench press, and rows.",
        "HIIT workout suggestion: 30 seconds work, 30 seconds rest - jumping jacks, push-ups, squats, mountain climbers.",
        "Don't forget to include rest days in your workout routine for proper recovery."
    ],
    nutrition: [
        "Make sure to eat plenty of protein and vegetables with each meal.",
        "Stay hydrated! Aim to drink at least 8 glasses of water daily.",
        "Consider eating smaller meals throughout the day instead of three large ones.",
        "Post-workout nutrition tip: consume protein within 30 minutes after exercise.",
        "Include healthy fats in your diet like avocados, nuts, and olive oil.",
        "Try to eat a rainbow of vegetables to get diverse nutrients.",
        "Pre-workout meal suggestion: banana with peanut butter or oatmeal with berries."
    ],
    equipment: [
        "When using weights, always start lighter and focus on form first.",
        "Clean equipment before and after use for hygiene.",
        "Adjust machine settings to your body size before starting.",
        "For beginners, start with body weight exercises before moving to equipment.",
        "Make sure safety clips are secured when using the barbell.",
        "Wipe down equipment after use and return weights to their proper place.",
        "Don't hesitate to ask staff for help with equipment you're unfamiliar with."
    ],
    motivation: [
        "Remember, every small step counts towards your fitness goals.",
        "Track your progress to stay motivated - take measurements or progress photos.",
        "Find a workout buddy to help keep you accountable.",
        "Set realistic, achievable goals and celebrate small victories.",
        "It's okay to have off days, what matters is getting back on track.",
        "Try to make exercise a regular part of your daily routine.",
        "Focus on how you feel, not just how you look."
    ],
    stretching: [
        "Hold each stretch for 15-30 seconds without bouncing.",
        "Always stretch after your muscles are warmed up.",
        "Include dynamic stretches in your warm-up routine.",
        "Don't forget to stretch both sides of your body equally.",
        "Practice yoga for improved flexibility and mindfulness.",
        "Remember to breathe deeply while stretching.",
        "Focus on stretching the muscles you just worked after exercise."
    ],
    general: [
        "Remember to maintain proper form during exercises to prevent injury.",
        "Getting enough sleep is crucial for fitness and recovery.",
        "Consistency is key in achieving your fitness goals.",
        "Listen to your body and don't push through sharp pain.",
        "Take progress photos or measurements to track your journey.",
        "Remember to breathe properly during exercises.",
        "Schedule regular rest days to prevent overtraining.",
        "Stay consistent with your routine but allow for flexibility."
    ]
};

const getFallbackResponse = (message) => {
    message = message.toLowerCase();

    // Check message content and return appropriate category response
    if (message.includes('workout') || message.includes('exercise') || message.includes('training') || message.includes('routine')) {
        return fallbackResponses.workout[Math.floor(Math.random() * fallbackResponses.workout.length)];
    }
    if (message.includes('food') || message.includes('eat') || message.includes('diet') || message.includes('nutrition') || message.includes('meal')) {
        return fallbackResponses.nutrition[Math.floor(Math.random() * fallbackResponses.nutrition.length)];
    }
    if (message.includes('equipment') || message.includes('machine') || message.includes('weights') || message.includes('gym')) {
        return fallbackResponses.equipment[Math.floor(Math.random() * fallbackResponses.equipment.length)];
    }
    if (message.includes('motivat') || message.includes('goal') || message.includes('stuck') || message.includes('help')) {
        return fallbackResponses.motivation[Math.floor(Math.random() * fallbackResponses.motivation.length)];
    }
    if (message.includes('stretch') || message.includes('flexible') || message.includes('mobility') || message.includes('yoga')) {
        return fallbackResponses.stretching[Math.floor(Math.random() * fallbackResponses.stretching.length)];
    }
    return fallbackResponses.general[Math.floor(Math.random() * fallbackResponses.general.length)];
};

const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received chat request:', { message });
        console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

        // Try OpenAI first
        try {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OpenAI API key is not configured');
            }

            console.log('Creating chat completion...');
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                max_tokens: 300,
                temperature: 0.7,
            });

            console.log('Chat completion successful');
            const response = completion.choices[0].message.content;
            res.json({ response });
        } catch (openaiError) {
            // If OpenAI fails, use fallback responses
            console.log('OpenAI API error, using fallback response:', openaiError.message);
            const fallbackResponse = getFallbackResponse(message);
            res.json({
                response: fallbackResponse,
                note: "Using fallback response system. For more detailed responses, please set up OpenAI API billing."
            });
        }
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to process chat request',
            details: error.message
        });
    }
};

export { handleChat }; 