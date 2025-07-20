# Template Orchestrator Elimination TODO

## **🎯 OBJECTIVE**

Completely remove the fake "Template Orchestrator" from the codebase with zero traces left behind.

---

## **📋 ELIMINATION TASKS**

### **PHASE 1: Remove Hardcoded Definitions**

#### **TODO 1.1: Remove from Frontend API**

- [ ] **File**: `pages/api/orchestrations.js`
- [ ] **Action**: Remove entire `template` block from `baseOrchestrations`
- [ ] **Lines**: ~52-67 (template orchestration definition)
- [ ] **Backup**: `cp pages/api/orchestrations.js pages/api/orchestrations.js.backup`

#### **TODO 1.2: Remove from Backend Server**

- [ ] **File**: `hive/server.js`
- [ ] **Action**: Remove entire `template` block from `baseOrchestrations`
- [ ] **Lines**: ~556-571 (template orchestration definition)
- [ ] **Backup**: `cp hive/server.js hive/server.js.backup`

---

### **PHASE 2: Remove Frontend Components**

#### **TODO 2.1: Delete TemplateOrchestrationPage Component**

- [ ] **File**: `frontend/src/components/orchestrations/TemplateOrchestrationPage.tsx`
- [ ] **Action**: Delete entire file
- [ ] **Command**: `rm frontend/src/components/orchestrations/TemplateOrchestrationPage.tsx`

#### **TODO 2.2: Remove from OrchestrationsPage.tsx**

- [ ] **File**: `frontend/src/components/OrchestrationsPage.tsx`
- [ ] **Action**: Remove template orchestration from hardcoded fallback array
- [ ] **Lines**: ~74-89 (template orchestration object)
- [ ] **Note**: Remove entire object block

#### **TODO 2.3: Remove from WorkflowsPage.tsx**

- [ ] **File**: `frontend/src/components/WorkflowsPage.tsx`
- [ ] **Action**: Remove template orchestration from both fallback arrays
- [ ] **Lines**: ~281-283 and ~292-294
- [ ] **Note**: Remove both instances of template orchestration

#### **TODO 2.4: Remove from AgentsPage.tsx**

- [ ] **File**: `frontend/src/components/AgentsPage.tsx`
- [ ] **Action**: Remove template orchestration color mapping
- [ ] **Line**: ~152 (`"Template Orchestrator": "bg-gray-100 text-gray-800 border-gray-200"`)

---

### **PHASE 3: Remove Documentation References**

#### **TODO 3.1: Remove from docs/orchestrations/README.md**

- [ ] **File**: `docs/orchestrations/README.md`
- [ ] **Action**: Remove template orchestration documentation link
- [ ] **Line**: ~10 (`- [Template Orchestrator](./TemplateOrchestrator.md) - Example orchestration template`)

#### **TODO 3.2: Remove from pages/api/orchestration-documentation.js**

- [ ] **File**: `pages/api/orchestration-documentation.js`
- [ ] **Action**: Remove template orchestration documentation mapping
- [ ] **Line**: ~17 (`template: "docs/orchestrations/TemplateOrchestrator.md"`)

#### **TODO 3.3: Remove from hive/server.js (documentation section)**

- [ ] **File**: `hive/server.js`
- [ ] **Action**: Remove template orchestration documentation mapping
- [ ] **Line**: ~805 (`template: "docs/orchestrations/TemplateOrchestrator.md"`)

---

### **PHASE 4: Clean Up Type Definitions**

#### **TODO 4.1: Check TypeScript Interfaces**

- [ ] **Files**: All TypeScript files in `frontend/src/`
- [ ] **Action**: Search for any hardcoded references to "template" orchestration
- [ ] **Command**: `grep -r "template.*orchestrator" frontend/src/`
- [ ] **Action**: Remove any found references

---

## **🔍 VERIFICATION TASKS**

### **TODO 5.1: Search for Remaining References**

- [ ] **Command**: `grep -r "Template Orchestrator" .`
- [ ] **Expected**: No results
- [ ] **Action**: Remove any remaining references found

### **TODO 5.2: Search for Template Orchestration ID**

- [ ] **Command**: `grep -r "id.*template" .`
- [ ] **Expected**: No results
- [ ] **Action**: Remove any remaining references found

### **TODO 5.3: Search for Template Orchestration Name**

- [ ] **Command**: `grep -r "template.*orchestrator" .`
- [ ] **Expected**: No results
- [ ] **Action**: Remove any remaining references found

---

## **✅ VERIFICATION CHECKLIST**

### **TODO 6.1: UI Verification**

- [ ] **Check**: Template Orchestrator no longer appears in orchestration selection UI
- [ ] **Check**: Only real orchestrations (Hyatt, Generic, Hive) are visible
- [ ] **Check**: No broken links or missing pages

### **TODO 6.2: API Verification**

- [ ] **Check**: `/api/orchestrations` endpoint returns no template orchestration
- [ ] **Check**: API response only includes real orchestrations
- [ ] **Check**: No 404 errors for template orchestration

### **TODO 6.3: Documentation Verification**

- [ ] **Check**: No broken documentation links
- [ ] **Check**: Documentation index doesn't reference template
- [ ] **Check**: No missing documentation files

### **TODO 6.4: Component Verification**

- [ ] **Check**: TemplateOrchestrationPage.tsx file is deleted
- [ ] **Check**: No imports reference template orchestration
- [ ] **Check**: No TypeScript compilation errors

---

## **🚨 ROLLBACK PLAN**

### **TODO 7.1: Backup Verification**

- [ ] **Check**: `pages/api/orchestrations.js.backup` exists
- [ ] **Check**: `hive/server.js.backup` exists
- [ ] **Test**: Can restore from backups if needed

### **TODO 7.2: Rollback Commands**

- [ ] **If needed**: `cp pages/api/orchestrations.js.backup pages/api/orchestrations.js`
- [ ] **If needed**: `cp hive/server.js.backup hive/server.js`
- [ ] **If needed**: Restore any deleted component files

---

## **📝 NOTES**

### **Files to Delete:**

- `frontend/src/components/orchestrations/TemplateOrchestrationPage.tsx`

### **Files to Edit:**

- `pages/api/orchestrations.js`
- `hive/server.js`
- `frontend/src/components/OrchestrationsPage.tsx`
- `frontend/src/components/WorkflowsPage.tsx`
- `frontend/src/components/AgentsPage.tsx`
- `docs/orchestrations/README.md`
- `pages/api/orchestration-documentation.js`

### **Expected Result:**

- **Only 3 real orchestrations remain**: Hyatt, Generic, Hive
- **No fake orchestrations** in UI or API
- **Clean, consistent** orchestration system
- **No user confusion** about non-functional orchestrations

---

## **🎯 COMPLETION CRITERIA**

- [ ] **All TODO items completed**
- [ ] **No "Template Orchestrator" references found in codebase**
- [ ] **UI shows only functional orchestrations**
- [ ] **API returns only real orchestrations**
- [ ] **No broken links or missing files**
- [ ] **System functions normally** with real orchestrations
