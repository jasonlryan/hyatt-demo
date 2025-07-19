# Folder Renaming Plan: `hyatt-gpt-prototype` → `hive`

## 📋 Overview

The `hyatt-gpt-prototype` folder is no longer Hyatt-specific and has evolved into the Hive orchestration system. This plan documents the impact and required changes for renaming this folder to accurately reflect its current purpose.

## 🎯 Objective

Rename `hyatt-gpt-prototype/` to `hive/` to accurately represent the current functionality and purpose of this backend orchestration system.

## 📊 Impact Assessment

### 🔴 **Critical Impact - Immediate Breaking Changes**

#### **1. Shell Scripts**

- **File**: `start-hyatt-gpt.sh`

  - **Line**: 3
  - **Change**: `cd "$(dirname "$0")/hyatt-gpt-prototype"` → `cd "$(dirname "$0")/hive"`
  - **Impact**: Script will fail to find directory

- **File**: `start-servers.sh`
  - **Line**: 22
  - **Change**: `cd hyatt-gpt-prototype` → `cd hive`
  - **Impact**: Server startup will fail

#### **2. Package.json Scripts**

- **File**: Root `package.json`

  - **Lines**: 5, 6, 10
  - **Changes**:
    - `"start": "cd hyatt-gpt-prototype && npm run smart-start"` → `"start": "cd hive && npm run smart-start"`
    - `"dev": "cd hyatt-gpt-prototype && npm run dev"` → `"dev": "cd hive && npm run dev"`
    - `"start:backend": "npm start --prefix hyatt-gpt-prototype"` → `"start:backend": "npm start --prefix hive"`
  - **Impact**: npm scripts will fail

- **File**: `hyatt-gpt-prototype/package.json`
  - **Line**: 1
  - **Change**: `"name": "hyatt-gpt-prototype"` → `"name": "hive"`
  - **Impact**: Package identification will be updated

#### **3. API References**

- **File**: `pages/api/save-orchestration.js`
  - **Line**: 347
  - **Change**: Hardcoded path reference needs updating
  - **Impact**: API may fail to save orchestrations correctly

### 🟡 **Medium Impact - Documentation & Configuration**

#### **4. Documentation Files**

- **File**: `docs/system/architecture.md`

  - **Lines**: 59, 208, 209, 250
  - **Impact**: Architecture documentation will be outdated

- **File**: `docs/system/setup.md`

  - **Lines**: 30, 40, 43, 68, 84, 108, 109, 147, 175, 193
  - **Impact**: Setup instructions will be incorrect

- **File**: `docs/README.md`

  - **Line**: 59
  - **Impact**: Main documentation will be outdated

- **File**: `docs/orchestrations/OrchestrationBuilder.md`
  - **Line**: 171
  - **Impact**: Builder documentation will be outdated

#### **5. Configuration Files**

- **File**: `.gitignore`

  - **Line**: 64
  - **Change**: `hyatt-gpt-prototype/campaigns/*.json` → `hive/campaigns/*.json`
  - **Impact**: Campaign files may not be ignored correctly

- **File**: `.cursor/rules/migration_rules.mdc`
  - **Line**: 17
  - **Impact**: Development rules will reference non-existent path

#### **6. Archive Documentation**

- **Files**: Multiple files in `archive/legacy-docs/`
  - **Impact**: Historical documentation will be outdated

### 🟢 **Low Impact - Internal References**

#### **7. Internal Code References**

- **File**: `hyatt-gpt-prototype/agents/classes/ResearchAudienceAgent.js`
  - **Lines**: 83, 115, 116, 128
  - **Impact**: These references will be renamed with the folder

## 📝 Implementation Plan

### **Phase 1: Pre-Rename Preparation**

1. **Create backup** of current state
2. **Update shell scripts** to use new folder name
3. **Update package.json scripts** in root directory
4. **Update API references** in pages/api/

### **Phase 2: Folder Rename**

1. **Rename folder**: `hyatt-gpt-prototype/` → `hive/`
2. **Update internal package.json** name
3. **Test basic functionality**

### **Phase 3: Documentation Updates**

1. **Update system documentation** (architecture.md, setup.md)
2. **Update main README**
3. **Update configuration files** (.gitignore, .cursor/rules/)
4. **Update archive documentation**

### **Phase 4: Testing & Validation**

1. **Test shell scripts** work with new folder name
2. **Test npm scripts** function correctly
3. **Test API endpoints** still work
4. **Validate documentation** accuracy

## 🔧 Required Changes Summary

### **Files Requiring Updates (Total: ~25 files)**

```
🔴 CRITICAL (Immediate breaking):
├── start-hyatt-gpt.sh
├── start-servers.sh
├── package.json (root)
├── hyatt-gpt-prototype/package.json → hive/package.json
└── pages/api/save-orchestration.js

🟡 DOCUMENTATION (Need updating):
├── docs/system/architecture.md
├── docs/system/setup.md
├── docs/README.md
├── docs/orchestrations/OrchestrationBuilder.md
├── .gitignore
├── .cursor/rules/migration_rules.mdc
└── archive/legacy-docs/* (multiple files)

🟢 INTERNAL (Will be renamed with folder):
└── hyatt-gpt-prototype/**/* → hive/**/*
```

## ⚠️ Risks & Considerations

### **Immediate Risks**

1. **Shell scripts will fail** until updated
2. **npm scripts will break** until package.json is updated
3. **API functionality may be affected** if hardcoded paths exist

### **Documentation Risks**

1. **Team confusion** from outdated documentation
2. **Setup instructions** will be incorrect
3. **Development workflow** disruption

### **Mitigation Strategies**

1. **Update critical files first** before renaming
2. **Test thoroughly** after each phase
3. **Communicate changes** to team members
4. **Keep backup** of original folder during transition

## ✅ Success Criteria

- [ ] All shell scripts work with new folder name
- [ ] All npm scripts function correctly
- [ ] API endpoints work without issues
- [ ] Documentation is accurate and up-to-date
- [ ] Development workflow is uninterrupted
- [ ] No breaking changes for team members

## 📅 Timeline Estimate

- **Phase 1**: 1-2 hours (preparation)
- **Phase 2**: 30 minutes (rename + basic testing)
- **Phase 3**: 2-3 hours (documentation updates)
- **Phase 4**: 1 hour (testing & validation)

**Total Estimated Time**: 4-6 hours

## 🎯 Recommendation

**Proceed with the rename** - the benefits of accurate naming outweigh the update effort. The impact is manageable and mostly involves documentation updates. It's better to do this now before the codebase grows further and the impact becomes larger.

The rename will:

- ✅ Improve codebase clarity
- ✅ Better reflect current functionality
- ✅ Reduce confusion for new team members
- ✅ Set proper foundation for future development
