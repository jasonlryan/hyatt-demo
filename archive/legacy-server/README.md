# Legacy Server Archive

This folder contains archived elements from the old `hyatt-gpt-prototype` server that was migrated to the new `hive` server.

## Archived Files

### `start-hyatt-gpt.sh`

- **Original Location**: Root directory
- **Purpose**: Legacy startup script for the old hyatt-gpt-prototype server
- **Status**: Deprecated - replaced by `start-servers.sh`
- **Size**: 105 bytes

### `hyatt_gpts_implementation_plan.md`

- **Original Location**: `archive/legacy-docs/implementation-plans/`
- **Purpose**: Implementation plan for the original Hyatt GPT prototype
- **Status**: Historical documentation
- **Content**: Original server architecture and implementation details

## Migration Summary

### Old Server Structure (Deprecated)

- **Directory**: `hyatt-gpt-prototype/` → **DELETED**
- **Server**: `hyatt-gpt-prototype/server.js` → **DELETED**
- **Startup Script**: `start-hyatt-gpt.sh` → **ARCHIVED**

### New Server Structure (Active)

- **Directory**: `hive/` → **ACTIVE**
- **Server**: `hive/server.js` → **ACTIVE**
- **Startup Script**: `start-servers.sh` → **ACTIVE**

## Migration Date

- **Completed**: July 2025
- **Status**: ✅ Fully migrated
- **Current Server**: Hive Agents System (Port 3000)

## Notes

- All active code has been updated to use the new `hive` server
- No functional dependencies remain on the old server
- This archive is for historical reference only
