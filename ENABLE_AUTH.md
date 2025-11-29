# 🔐 Enabling Authentication in Supabase

## Quick Fix: Enable Anonymous Sign-In

If you see this error: **"Anonymous sign-ins are disabled"**

### Steps to Enable (2 minutes):

1. **Go to your Supabase Dashboard**

   - Open [supabase.com](https://supabase.com)
   - Select your CourtFlow project

2. **Navigate to Authentication**

   - Click on the **🔑 Authentication** icon in the left sidebar
   - Click on **Providers** tab

3. **Enable Anonymous Sign-In**

   - Scroll down to find **"Anonymous"**
   - Toggle it **ON** (should turn green)
   - Click **Save** if there's a save button

4. **Refresh Your App**
   - Reload your browser at `http://localhost:5173`
   - The error should be gone!

---

## Alternative: Use Email Authentication

If you prefer email-based authentication instead:

### 1. Enable Email Provider

- In Supabase Dashboard → Authentication → Providers
- Ensure **Email** is enabled (usually enabled by default)

### 2. Create a Test User

- Go to Authentication → Users
- Click **"Add User"**
- Enter an email and password
- Click **"Create User"**

### 3. Update App.tsx (Optional)

You can modify the authentication flow to use email instead of anonymous auth.

---

## Why Anonymous Auth?

Anonymous authentication is perfect for:

- ✅ **Demo purposes** - Users can try the app immediately
- ✅ **Quick prototyping** - No sign-up friction
- ✅ **Testing** - Easy to test without creating accounts

Users sign in automatically without providing credentials, and each session gets a unique user ID.

---

## Current Behavior

The app has a **fallback demo mode** if anonymous auth is disabled:

- Creates a temporary demo session
- Allows you to use the app
- Data won't persist (you'll need to enable proper auth)

**For production use, enable Anonymous Auth or Email Auth!**

---

## Security Note

Anonymous users are still authenticated and subject to Row Level Security (RLS) policies. Each anonymous user gets:

- A unique user ID
- Their own isolated school/data
- Secure database access

---

## Need More Help?

Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
