# 🚀 START HERE - Cline AI Instructions

**CRITICAL: Read this file FIRST before doing anything else!**

---

## ⚠️ DO NOT LIST FILES OR EXPLORE DIRECTORY STRUCTURE

**STOP trying to list files or explore the directory!** This causes infinite loops.

**Instead, follow these exact steps:**

---

## 📋 STEP 1: Read These Files in Order

1. **Read `TASKS_FOR_CLINE.md`** - This contains your specific tasks
2. **Read `CHANGELOG.md`** - This shows what has been done and what's pending
3. **Read `BACKEND_ENV_TEMPLATE.md`** - This is the template for `.env.example`

**DO NOT use `list_files` or `list_dir` tools. Just read the files directly using `read_file`.**

---

## 🎯 STEP 2: Your Primary Task

**Your job is to build the BACKEND infrastructure:**

1. **Create `.env.example` file** using the template in `BACKEND_ENV_TEMPLATE.md`
2. **Set up Node.js/Express backend server** in a `backend/` directory
3. **Set up Pocketbase integration** (or another database solution)
4. **Create API endpoints** for products, cart, orders, users
5. **Implement authentication** (JWT-based)
6. **Set up file upload** for product images

---

## 📝 STEP 3: How to Log Your Work

**After EVERY change you make:**

1. **Update `CHANGELOG.md`** - Add a new entry at the top with:
   - Date/time
   - What you did
   - Files changed
   - Summary

**Example format:**
```markdown
### [2025-01-13 14:30] - Cline AI - BACKEND-SETUP
**Type:** Created
**Files Changed:**
- `backend/.env.example` - Created environment variables template
- `backend/src/index.ts` - Created Express server entry point

**Summary:** Set up basic Express server with TypeScript
**Status:** In Progress
```

---

## ✅ STEP 4: What NOT to Do

❌ **DO NOT:**
- List files or directories
- Try to explore the codebase structure
- Modify frontend files (that's Cursor AI's job)
- Create duplicate files
- Work on tasks already completed (check CHANGELOG.md first)

✅ **DO:**
- Read the task files first
- Work on backend tasks only
- Update CHANGELOG.md after each change
- Ask for clarification if stuck (but don't loop)

---

## 🔧 STEP 5: If You Get Stuck

1. **Check `CHANGELOG.md`** - See what's been done
2. **Check `TASKS_FOR_CLINE.md`** - Review your tasks
3. **Check `CLINE_ERROR_FIXES.md`** - See if your error was fixed before
4. **Update `CHANGELOG.md`** with your error and what you tried
5. **Move to next task** - Don't get stuck on one thing

---

## 📂 File Structure You Should Create

```
backend/
├── src/
│   ├── index.ts          # Server entry point
│   ├── config/           # Configuration files
│   ├── routes/           # API routes
│   ├── controllers/      # Route handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── types/            # TypeScript types
├── .env.example          # Environment variables template
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

---

## 🎯 Current Priority Tasks

1. **Create `.env.example`** (HIGHEST PRIORITY - Do this first!)
2. **Set up Express server** with TypeScript
3. **Create basic API structure**
4. **Set up database connection**

---

## 💡 Quick Start Command

**Copy and paste this to start:**

```
I will read TASKS_FOR_CLINE.md first, then create the backend infrastructure starting with .env.example file.
```

**Then actually do it - don't just say you will!**

---

## ⚠️ REMEMBER

- **NO file listing** - Just read files directly
- **Update CHANGELOG.md** after every change
- **Backend only** - Don't touch frontend
- **One task at a time** - Complete it, log it, move on

**Now go read `TASKS_FOR_CLINE.md` and start working!**

