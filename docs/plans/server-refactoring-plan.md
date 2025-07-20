# Server Refactoring Plan

## **🎯 OBJECTIVE**

Break down the massive `hive/server.js` file (1,328 lines) into smaller, manageable files.

## **📋 CURRENT STATE**

**`hive/server.js`** is **1,328 lines** with everything mixed together:

- Campaign endpoints
- Generation endpoints
- Visual/Hive endpoints
- File management
- All in one file

## **✅ SIMPLE SOLUTION**

Split into **4 route files** based on functionality:

```
hive/
├── server.js (~50 lines - main setup)
├── routes/
│   ├── campaigns.js (campaign management)
│   ├── generation.js (AI generation)
│   ├── visual.js (visual/Hive endpoints)
│   └── files.js (file management)
```

## **🚀 IMPLEMENTATION STEPS**

### **Step 1: Create routes folder**

```bash
mkdir hive/routes
```

### **Step 2: Extract campaign routes**

Move all campaign-related endpoints to `hive/routes/campaigns.js`:

- `/api/campaigns` (GET, POST)
- `/api/campaigns/:id/*` (all campaign operations)

### **Step 3: Extract generation routes**

Move all generation endpoints to `hive/routes/generation.js`:

- `/api/generate-orchestration`
- `/api/generate-page`
- `/api/generate-component`
- `/api/generate-diagram`

### **Step 4: Extract visual routes**

Move all visual/Hive endpoints to `hive/routes/visual.js`:

- `/api/hive-orchestrate`
- `/api/generate-image`

### **Step 5: Extract file routes**

Move all file management to `hive/routes/files.js`:

- `/api/save-orchestration`
- `/api/save-css`

### **Step 6: Update main server.js**

Keep only:

- Express setup
- Middleware
- Route imports
- Server startup

## **⚠️ RISKS**

- **Breaking functionality**: Moving code could introduce bugs
- **Import issues**: Module dependencies might break

## **🛡️ MITIGATION**

- **Test each file** after moving
- **Keep backup** of original server.js
- **Move one group at a time**

## **📋 SIMPLE CHECKLIST**

- [ ] Create routes folder
- [ ] Move campaign endpoints
- [ ] Move generation endpoints
- [ ] Move visual endpoints
- [ ] Move file endpoints
- [ ] Update server.js imports
- [ ] Test everything works
- [ ] Delete original code from server.js

## **🎯 EXPECTED OUTCOME**

- **server.js**: ~50 lines instead of 1,328
- **4 focused route files**: Each handling one concern
- **Same functionality**: Everything works exactly as before
- **Easier maintenance**: Find and modify specific endpoints

---

**Simple, practical refactoring to make the code more manageable.**
