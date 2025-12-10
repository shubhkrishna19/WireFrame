# 📢 EXACT PROMPT TO GIVE TO CLINE AI

**⚠️ CRITICAL: Copy and paste this EXACT prompt to Cline AI in VS Code**

---

## 🎯 Copy This Prompt to Cline:

```
I need you to work on backend development for this e-commerce project.

CRITICAL INSTRUCTIONS - READ THESE FIRST:
1. DO NOT use list_files or list_dir tools - this causes infinite loops
2. Read files directly using read_file tool
3. Start by reading START_HERE_CLINE.md - this contains critical instructions
4. Then read TASKS_FOR_CLINE.md to see your tasks
5. Read CHANGELOG.md to see what Cursor AI has done
6. Read BACKEND_ENV_TEMPLATE.md for the .env.example template

YOUR FIRST TASK: Create backend/.env.example file using the template from BACKEND_ENV_TEMPLATE.md

CRITICAL RULE: After EVERY change you make, you MUST update CHANGELOG.md. Log every file you create or modify using this format:

### [YYYY-MM-DD HH:MM] - Cline AI - [TASK-ID]
**Type:** Created/Modified/Deleted
**Files Changed:**
- `path/to/file.ts` - [Description of change]

**Summary:** [Brief summary]
**Status:** In Progress/Completed

DO NOT try to explore the directory structure. Just read the files I mentioned and start working on the backend tasks.

Let me know when you've read START_HERE_CLINE.md and are ready to start.
```

---

## ✅ What This Fixes:

1. **Prevents infinite loops** - Explicitly tells Cline NOT to list files
2. **Clear entry point** - Directs to START_HERE_CLINE.md first
3. **Specific first task** - Creates .env.example (simple, concrete task)
4. **Clear instructions** - Uses read_file directly, not exploration

---

## 🔄 If Cline Still Gets Stuck:

If Cline still tries to list files, give it this additional prompt:

```
STOP. Do not use list_files or list_dir. 

Instead, use the read_file tool directly:
- read_file("START_HERE_CLINE.md")
- read_file("TASKS_FOR_CLINE.md")
- read_file("BACKEND_ENV_TEMPLATE.md")

Then create backend/.env.example using the template.
```

---

## 📝 Current Process:

1. **User gives Cline the prompt above** ← YOU DO THIS NOW
2. **Cline reads START_HERE_CLINE.md** (prevents loops)
3. **Cline reads task files** using read_file
4. **Cline creates backend/.env.example** (first concrete task)
5. **Cline updates CHANGELOG.md** after every change
6. **Cline continues with backend setup**

---

**READY? Copy the prompt above and give it to Cline now!**
