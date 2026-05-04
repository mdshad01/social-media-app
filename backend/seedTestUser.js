// Seed test user for CI/CD E2E tests
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedTestUser = async () => {
  try {
    console.log('🌱 Seeding test database...');
    
    // Connect to database
    await mongoose.connect(process.env.DB || 'mongodb://localhost:27017/social-media-test');
    console.log('✅ Connected to test database');
    
    // Define User schema (must match your actual User model)
    const userSchema = new mongoose.Schema({
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
      savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
      profilePicture: { type: String },
      bio: { type: String },
      otp: { type: String },
      otpExpires: { type: Date },
    }, { timestamps: true });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'onlyforstudy12hr@gamil.com' });
    
    if (existingUser) {
      console.log('✅ Test user already exists');
      await mongoose.connection.close();
      process.exit(0);
      return;
    }
    
    // Create test user
    const hashedPassword = await bcrypt.hash('123@Rider', 12);
    
    const testUser = await User.create({
      username: 'Alia',
      email: 'onlyforstudy12hr@gamil.com',
      password: hashedPassword,
      isVerified: true,
      posts: [],
      savedPosts: [],
      bio: 'Test user for E2E tests',
    });
    
    console.log('✅ Test user created successfully');
    console.log('   Email:', testUser.email);
    console.log('   Username:', testUser.username);
    console.log('   ID:', testUser._id);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding test user:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedTestUser();
