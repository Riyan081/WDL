## 🎬 Netflix Clone - Admin Login Credentials

### 🔑 **ADMIN ACCESS (Already Created)**
```
Email: admin@netflix.com
Password: Admin@123
Role: ADMIN
```

### 👤 **DEMO USER ACCESS**
```
Email: demo@netflix.com  
Password: Demo@123
Role: USER
```

---

### 🚀 **How to Login as Admin:**

1. **Open the Application**: http://localhost:5176
2. **On the login page, enter**:
   - **Email**: `admin@netflix.com`
   - **Password**: `Admin@123`
3. **Click "Sign In"**
4. **You'll be automatically redirected to Admin Panel** (`/admin`)

### ✅ **After Admin Login You Get:**
- **Admin Dashboard**: System statistics and overview
- **User Management**: View, manage, and delete user accounts
- **Movies Management**: Add, edit, delete movies
- **Series Management**: Create series with seasons and episodes
- **Content Analytics**: View content statistics
- **Admin Header**: Special admin navigation with "Admin Panel" button

### 🎯 **Admin vs User Experience:**
- **Regular Users** → Go to `/browse` (main Netflix interface)
- **Admin Users** → Go to `/admin` (admin dashboard)
- **Admin can also access** `/browse` via the "Admin Panel" button in header

---

### 🛠️ **Create Additional Admin Users:**
```bash
cd server
npm run create-admin
```
This will prompt you to enter name, email, and password for a new admin user.

### � **Security Features:**
- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens for secure authentication
- Role-based route protection
- Admin routes are inaccessible to regular users
