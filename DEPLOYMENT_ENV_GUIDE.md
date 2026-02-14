# Environment Variables Setup Guide

## 🚀 Deployment URLs

### Phase 3 (AI Chatbot - Current)
- **Frontend (Vercel)**: https://taskflow-phase3-ai-chatbot.vercel.app
- **Backend (Hugging Face)**: https://mnusrulah104-todoapp-chatbot.hf.space
- **GitHub Repository**: https://github.com/mnusrullah104/todo-web_phase3

### Phase 2 (Previous - Unchanged)
- **Frontend (Vercel)**: https://todo-fullstack-mna-86.vercel.app
- **GitHub Repository**: https://github.com/mnusrullah104/todo_web_phase2

---

## 🔧 Hugging Face Space (Backend) - Environment Variables

Go to: https://huggingface.co/spaces/mnusrulah104/todoapp_chatbot/settings

Click on **"Repository secrets"** and add these 3 variables:

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_hrqynGo9ZWJ5@ep-polished-water-ai6shq6e-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
**Purpose**: PostgreSQL database connection string (Neon Serverless)

### 2. JWT_SECRET
```
generate-a-secure-random-key-min-32-characters
```
**Purpose**: Secret key for JWT token signing and verification
**Note**: Replace with a strong random string (minimum 32 characters)

### 3. COHERE_API_KEY
```
your-cohere-api-key-here
```
**Purpose**: Cohere AI API key for chatbot functionality
**Get it from**: https://dashboard.cohere.com/api-keys

---

## 🌐 Vercel (Frontend) - Environment Variables

Go to: https://vercel.com/muhammad-nasrullahs-projects/taskflow-phase3-ai-chatbot/settings/environment-variables

Add this 1 variable:

### 1. NEXT_PUBLIC_API_URL
```
https://mnusrulah104-todoapp-chatbot.hf.space
```
**Purpose**: Backend API URL for all API calls
**Scope**: Production, Preview, Development

---

## 📋 Quick Setup Checklist

### Hugging Face Space Setup:
- [ ] Go to Space Settings → Repository secrets
- [ ] Add `DATABASE_URL` (PostgreSQL connection string)
- [ ] Add `JWT_SECRET` (32+ character random string)
- [ ] Add `COHERE_API_KEY` (from Cohere dashboard)
- [ ] Wait for Space to rebuild (automatic)
- [ ] Verify at: https://mnusrulah104-todoapp-chatbot.hf.space/docs

### Vercel Setup:
- [ ] Go to Project Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_API_URL` = `https://mnusrulah104-todoapp-chatbot.hf.space`
- [ ] Set scope to: Production, Preview, Development
- [ ] Redeploy if needed: `vercel --prod`
- [ ] Verify at: https://todo-fullstack-mna-86.vercel.app

---

## 🧪 Testing Your Deployment

1. **Open Frontend**: https://taskflow-phase3-ai-chatbot.vercel.app
2. **Sign Up**: Create a new account
3. **Test AI Chat**: Click the blue chat icon
4. **Try Commands**:
   - "Add task: Buy groceries"
   - "Show my tasks"
   - "Go to dashboard"

---

## 🔍 Troubleshooting

### Backend Issues (Hugging Face):
- Check Space logs for errors
- Verify all 3 environment variables are set
- Test API: https://mnusrulah104-todoapp-chatbot.hf.space/docs

### Frontend Issues (Vercel):
- Check deployment logs
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors

### CORS Issues:
If you see CORS errors, the backend needs to allow your Vercel domain.
Update backend CORS settings to include: `https://taskflow-phase3-ai-chatbot.vercel.app`

---

## 📝 Notes

- **NEXT_PUBLIC_** prefix: Required for Next.js environment variables that need to be accessible in the browser
- **Hugging Face**: Environment variables are encrypted and only accessible to your Space
- **Vercel**: Environment variables are encrypted and injected at build time
- **Security**: Never commit `.env` files with real credentials to git

---

## 🔄 Updating Environment Variables

### Hugging Face:
1. Go to Space Settings → Repository secrets
2. Update the variable value
3. Space will automatically rebuild

### Vercel:
1. Go to Project Settings → Environment Variables
2. Update the variable value
3. Redeploy: `vercel --prod` or use Vercel dashboard

---

## ✅ Current Status

- ✅ Backend deployed on Hugging Face Space
- ✅ Frontend deployed on Vercel
- ⚠️ Environment variables need to be configured (see above)
- ⏳ Waiting for you to add the environment variables

Once you add the environment variables, your application will be fully functional!
