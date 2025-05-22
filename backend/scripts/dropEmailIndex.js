import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropEmailIndex = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('bookings');

    // List all indexes before dropping
    console.log('Current indexes:');
    const indexes = await collection.indexes();
    console.log(indexes);

    // Drop all indexes except _id
    console.log('Dropping all indexes...');
    await collection.dropIndexes();
    console.log('Dropped all indexes');

    // Create only the compound index we want
    console.log('Creating new compound index...');
    await collection.createIndex(
      { trainerId: 1, date: 1, timeSlot: 1 },
      {
        unique: true,
        partialFilterExpression: {
          status: { $in: ['pending', 'confirmed'] }
        },
        name: 'trainer_date_timeslot',
        background: true
      }
    );
    console.log('Created new compound index');

    // Verify final indexes
    console.log('Final indexes:');
    const finalIndexes = await collection.indexes();
    console.log(finalIndexes);

    console.log('Index update completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

dropEmailIndex(); 