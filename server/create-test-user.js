import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔐 Creating test user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@netflix.com' }
    });
    
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('📧 Email: test@netflix.com');
      console.log('🔑 Password: password123');
      return;
    }
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@netflix.com',
        password: hashedPassword,
        role: 'USER'
      }
    });
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@netflix.com');
    console.log('🔑 Password: password123');
    console.log('👤 User ID:', user.id);
    
    // Also create an admin user
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@netflix.com' }
    });
    
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      
      const admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@netflix.com',
          password: adminPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('🔧 Admin user created!');
      console.log('📧 Admin Email: admin@netflix.com');
      console.log('🔑 Admin Password: Admin@123');
    }
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
