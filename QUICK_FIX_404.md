# ⚡ QUICK FIX - Vercel 404 Error

**Problem**: Getting 404 NOT_FOUND at http://todo-web-phase2.vercel.app/

**Cause**: Root directory not set to `frontend`

---

## 🔧 Fix in 3 Steps

### 1. Go to Settings
https://vercel.com/dashboard → Click your project → **Settings**

### 2. Set Root Directory
General → Root Directory → **Edit** → Type: `frontend` → **Save**

### 3. Redeploy
Deployments → Latest deployment → **...** → **Redeploy**

---

## ✅ Done!

Wait 2-5 minutes, then visit: http://todo-web-phase2.vercel.app/

Should see landing page (not 404).

---

**Detailed guide**: `FIX_VERCEL_404.md`
