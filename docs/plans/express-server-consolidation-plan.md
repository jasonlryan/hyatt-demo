# Express Server Consolidation Plan

## **🎯 OBJECTIVE**

Move Next.js API routes to Express server and remove the `pages/api` directory.

## **📋 CURRENT STATE**

- **Express server** (`hive/server.js`) handles `/api/orchestrations` ✅
- **Next.js API routes** (`pages/api/*`) handle other endpoints
- **Frontend** proxies `/api/*` to Express server on port 3000
- **Problem**: Two different server frameworks doing the same thing

## **✅ SIMPLE SOLUTION**

Move the Next.js API routes into the Express server and delete `pages/api`.

## **🚀 IMPLEMENTATION STEPS**

### **Step 1: Copy Next.js routes to Express**

Move these files from `pages/api/` to `hive/server.js`:

```
pages/api/generate-orchestration.js → Express endpoint
pages/api/generate-page.js → Express endpoint
pages/api/generate-component.js → Express endpoint
pages/api/generate-diagram.js → Express endpoint
pages/api/save-orchestration.js → Express endpoint
pages/api/save-css.js → Express endpoint
pages/api/orchestration-documentation.js → Express endpoint
```

### **Step 2: Test the Express endpoints**

- Start Express server
- Test each endpoint works
- Verify frontend still works

### **Step 3: Delete Next.js API routes**

- Remove `pages/api` directory
- Clean up any Next.js API dependencies

## **⚠️ RISKS**

- **Breaking frontend**: If Express endpoints don't work exactly like Next.js
- **Response format changes**: Frontend expects specific response structures

## **🛡️ MITIGATION**

- **Test each endpoint** before deleting Next.js routes
- **Keep Next.js routes as backup** until Express endpoints are proven working
- **Simple rollback**: Restore `pages/api` if anything breaks

## **📋 CHECKLIST**

- [ ] Copy each Next.js route to Express server
- [ ] Test each Express endpoint works
- [ ] Test frontend with Express endpoints
- [ ] Delete `pages/api` directory
- [ ] Verify everything still works

## **🎯 EXPECTED OUTCOME**

- Single Express server handling all APIs
- No more Next.js API routes
- Cleaner, simpler architecture
- Frontend continues working exactly as before

---

**That's it. Simple and practical.**
