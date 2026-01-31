# 🚀 Deploy Backend to Your Hugging Face Space

**Your Space**: https://huggingface.co/spaces/mnusrulah104/todo-backend

---

## Step 1: Generate Secrets (2 minutes)

Run these commands and save the outputs:

```bash
# Generate SECRET_KEY
openssl rand -hex 32

# Generate BETTER_AUTH_SECRET
openssl rand -hex 32
```

**Windows PowerShell alternative:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Step 2: Clone Your Space (1 minute)

```bash
# Clone your Space
git clone https://huggingface.co/spaces/mnusrulah104/todo-backend
cd todo-backend
```

---

## Step 3: Copy Backend Files (2 minutes)

```bash
# From your project directory
cd D:\mna\hackathon_2

# Copy all backend files to the Space
xcopy /E /I backend todo-backend\

# Or if you're in the Space directory:
# xcopy /E /I D:\mna\hackathon_2\backend .
```

---

## Step 4: Add README.md (1 minute)

Copy the `HF_SPACE_README.md` file to your Space as `README.md`:

```bash
# From your project directory
copy HF_SPACE_README.md todo-backend\README.md

# Or manually copy the content
```

---

## Step 5: Configure Secrets (5 minutes)

1. Go to: https://huggingface.co/spaces/mnusrulah104/todo-backend/settings
2. Scroll to **"Repository secrets"**
3. Click **"Add a new secret"** for each:

| Secret Name | Value | Notes |
|-------------|-------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL URL | Get from https://console.neon.tech |
| `SECRET_KEY` | Output from Step 1 | 64-character hex string |
| `ALGORITHM` | `HS256` | Exactly as shown |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Number only |
| `BETTER_AUTH_SECRET` | Output from Step 1 | 64-character hex string |
| `BETTER_AUTH_URL` | `https://mnusrulah104-todo-backend.hf.space` | Your Space URL |
| `BACKEND_URL` | `https://mnusrulah104-todo-backend.hf.space` | Your Space URL |
| `FRONTEND_URL` | `http://localhost:3000` | Update after Vercel deploy |

**⚠️ IMPORTANT**:
- Get a NEW `DATABASE_URL` from Neon (rotate password first)
- Generate NEW secrets (don't use old ones from .env.example)

---

## Step 6: Push to Hugging Face (2 minutes)

```bash
# Make sure you're in the Space directory
cd todo-backend

# Add all files
git add .

# Commit
git commit -m "Deploy Todo Backend API"

# Push to Hugging Face
git push
```

---

## Step 7: Wait for Build (3-5 minutes)

1. Go to: https://huggingface.co/spaces/mnusrulah104/todo-backend
2. Watch the **Logs** tab
3. Wait for status to change to **"Running"**

---

## Step 8: Verify Deployment (1 minute)

Test your backend:

```bash
curl https://mnusrulah104-todo-backend.hf.space/health
```

**Expected response:**
```json
{"status": "healthy", "version": "1.0.0"}
```

**Also test in browser:**
- Health: https://mnusrulah104-todo-backend.hf.space/health
- API Docs: https://mnusrulah104-todo-backend.hf.space/docs

---

## ✅ Success!

Your backend is now live at:
**https://mnusrulah104-todo-backend.hf.space**

---

## 🐛 Troubleshooting

### Build fails
- Check **Logs** tab in your Space
- Verify `Dockerfile` is in root directory
- Ensure all files copied correctly

### Database connection error
- Verify `DATABASE_URL` is correct in secrets
- Check Neon database allows external connections
- Go to https://console.neon.tech → Settings → Allow connections

### Can't access API
- Wait 5 minutes for build to complete
- Check Space status shows "Running"
- Try accessing /health endpoint first

---

## 📝 Next Steps

1. ✅ Backend deployed
2. ⏳ Deploy frontend to Vercel
3. ⏳ Update `FRONTEND_URL` secret with Vercel URL
4. ⏳ Test the full application

---

**Your backend URL**: https://mnusrulah104-todo-backend.hf.space
