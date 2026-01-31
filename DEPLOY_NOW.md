# 🎯 DEPLOY YOUR BACKEND NOW - Copy & Paste Commands

**Your Space**: https://huggingface.co/spaces/mnusrulah104/todo-backend

---

## ⚡ Quick Deploy (Copy these commands)

### Step 1: Generate Secrets
```bash
# Run this twice and save both outputs
openssl rand -hex 32
```

### Step 2: Clone Your Space
```bash
cd D:\mna\hackathon_2
git clone https://huggingface.co/spaces/mnusrulah104/todo-backend
```

### Step 3: Copy Backend Files
```bash
xcopy /E /I backend todo-backend
```

### Step 4: Add README
```bash
copy HF_SPACE_README.md todo-backend\README.md
```

### Step 5: Push to Hugging Face
```bash
cd todo-backend
git add .
git commit -m "Deploy Todo Backend API"
git push
```

---

## 🔑 Configure Secrets (Do this in browser)

Go to: https://huggingface.co/spaces/mnusrulah104/todo-backend/settings

Add these 8 secrets:

| Secret Name | Value |
|-------------|-------|
| `DATABASE_URL` | Get from https://console.neon.tech |
| `SECRET_KEY` | First output from Step 1 |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `BETTER_AUTH_SECRET` | Second output from Step 1 |
| `BETTER_AUTH_URL` | `https://mnusrulah104-todo-backend.hf.space` |
| `BACKEND_URL` | `https://mnusrulah104-todo-backend.hf.space` |
| `FRONTEND_URL` | `http://localhost:3000` |

---

## ✅ Verify Deployment

After build completes (3-5 minutes), test:

```bash
curl https://mnusrulah104-todo-backend.hf.space/health
```

Or open in browser:
- https://mnusrulah104-todo-backend.hf.space/health
- https://mnusrulah104-todo-backend.hf.space/docs

---

**Your backend URL**: https://mnusrulah104-todo-backend.hf.space
