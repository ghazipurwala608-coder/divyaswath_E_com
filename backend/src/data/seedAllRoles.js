import 'dotenv/config'
import dns from 'dns'
import mongoose from 'mongoose'
import User from '../models/User.js'

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
} catch (e) {}

async function seedAllRoles() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in backend/.env')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    })
    console.log('MongoDB Connected successfully.')

    // 1. Super Admin
    const superAdminEmail = 'superadmin@divyaswasth.in'
    let superAdmin = await User.findOne({ email: superAdminEmail })
    if (superAdmin) {
      superAdmin.password = 'SuperAdmin@123'
      superAdmin.role = 'super_admin'
      superAdmin.accountActive = true
      await superAdmin.save()
      console.log('✅ Super Admin updated in DB:', superAdminEmail)
    } else {
      superAdmin = await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        phone: '9876543210',
        password: 'SuperAdmin@123',
        role: 'super_admin',
        accountActive: true,
      })
      console.log('✅ Super Admin created in DB:', superAdminEmail)
    }

    // 2. Store Admin
    const adminEmail = 'admin@divyaswasth.in'
    let admin = await User.findOne({ email: adminEmail })
    const farFuture = new Date('2030-12-31T23:59:59.999Z')
    if (admin) {
      admin.password = 'Admin@123456'
      admin.role = 'admin'
      admin.accountActive = true
      admin.subscription = {
        plan: 'Enterprise Admin',
        status: 'active',
        expiresAt: farFuture,
      }
      await admin.save()
      console.log('✅ Store Admin updated in DB:', adminEmail)
    } else {
      admin = await User.create({
        name: 'Divya Swasth Admin',
        email: adminEmail,
        phone: '9876543211',
        password: 'Admin@123456',
        role: 'admin',
        accountActive: true,
        subscription: {
          plan: 'Enterprise Admin',
          status: 'active',
          expiresAt: farFuture,
        },
      })
      console.log('✅ Store Admin created in DB:', adminEmail)
    }

    // 3. Delivery Boy
    const deliveryEmail = 'delivery@divyaswasth.in'
    let driver = await User.findOne({ email: deliveryEmail })
    if (driver) {
      driver.password = 'Delivery@123'
      driver.role = 'delivery_boy'
      driver.accountActive = true
      driver.deliveryActive = true
      driver.deliveryArea = 'Delhi NCR / Noida (201301)'
      driver.managedBy = admin._id
      await driver.save()
      console.log('✅ Delivery Boy updated in DB:', deliveryEmail)
    } else {
      driver = await User.create({
        name: 'Ramesh Kumar (Delivery)',
        email: deliveryEmail,
        phone: '9876543212',
        password: 'Delivery@123',
        role: 'delivery_boy',
        accountActive: true,
        deliveryActive: true,
        deliveryArea: 'Delhi NCR / Noida (201301)',
        managedBy: admin._id,
      })
      console.log('✅ Delivery Boy created in DB:', deliveryEmail)
    }

    // 4. Test Customer
    const customerEmail = 'customer@divyaswasth.in'
    let customer = await User.findOne({ email: customerEmail })
    if (customer) {
      customer.password = 'Customer@123'
      customer.role = 'customer'
      customer.accountActive = true
      await customer.save()
      console.log('✅ Customer updated in DB:', customerEmail)
    } else {
      customer = await User.create({
        name: 'Rahul Sharma',
        email: customerEmail,
        phone: '9876543213',
        password: 'Customer@123',
        role: 'customer',
        accountActive: true,
      })
      console.log('✅ Customer created in DB:', customerEmail)
    }

    console.log('\n========================================')
    console.log('🎉 ALL ROLE ACCOUNTS STORED IN DATABASE!')
    console.log('========================================\n')
  } catch (error) {
    console.error('Error seeding roles in DB:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
    console.log('Database disconnected.')
  }
}

seedAllRoles()
