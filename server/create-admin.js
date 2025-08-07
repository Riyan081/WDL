#!/usr/bin/env node

/**
 * 🔑 Create Additional Admin User Script
 * Run this to create new admin users for the Netflix Clone
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createAdminUser() {
  console.log('🎬 Netflix Clone - Admin User Creator\n');

  try {
    const name = await askQuestion('Enter admin name: ');
    const email = await askQuestion('Enter admin email: ');
    const password = await askQuestion('Enter admin password: ');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'ADMIN',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=dc2626&color=ffffff`
      }
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Name:', adminUser.name);
    console.log('🔑 Role:', adminUser.role);
    console.log('\n🎯 You can now login to the admin panel with these credentials.');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('\n❌ Error: Email already exists. Please use a different email.');
    } else {
      console.log('\n❌ Error creating admin user:', error.message);
    }
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdminUser();
