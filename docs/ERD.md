# Entity Relationship Diagram

This document describes the database schema for the Rick and Morty character management application.

## Database Overview

The application uses **PostgreSQL** with **Sequelize ORM** for data persistence. The schema supports user interactions (favorites, comments), character synchronization from the Rick and Morty API, and monitoring of data import jobs.

## ERD Diagram

```mermaid
erDiagram

    Characters {
        uuid id PK "Primary key"
        int external_id UK "Rick and Morty API ID (unique)"
        string name "Character name"
        string status "alive, dead, unknown"
        string species "Character species"
        string type "Character type/subspecies"
        string gender "male, female, genderless, unknown"
        string image "Avatar URL"
        jsonb origin "Origin location object"
        jsonb location "Current location object"
        enum sync_status "synced, deprecated"
        boolean is_active "Soft delete flag"
        timestamp last_imported_at "Last sync timestamp"
        timestamp createdAt "Record creation timestamp"
        timestamp updatedAt "Record update timestamp"
    }

    CronLogs {
        uuid id PK "Primary key"
        timestamp execution_date "Cron job execution time"
        int added_count "New characters added"
        int updated_count "Characters updated"
        int deprecated_count "Characters marked deprecated"
        string status "success, failed"
        text error_payload "Error details if failed"
        int duration_ms "Execution time in milliseconds"
        timestamp createdAt "Record creation timestamp"
    }
```

## Entity Descriptions

### Users
Manages user accounts for the application. Supports both registered and anonymous users.

**Key Fields:**
- `is_anonymous`: Allows guest users to interact without registration
- Uses UUIDs for enhanced security

### Characters
Stores Rick and Morty character data synchronized from the external API.

**Key Fields:**
- `external_id`: Unique constraint ensures no duplicate imports
- `sync_status`: Tracks data freshness (`synced` = current, `deprecated` = removed from API)
- `is_active`: Soft delete flag for data retention
- `origin` & `location`: JSONB fields store nested location objects from API
- `last_imported_at`: Enables incremental sync strategies

**Indexes:**
- `external_id` (unique)
- `sync_status`
- `is_active`

**Constraints:**
- Unique constraint on `(user_id, character_id)` prevents duplicate favorites
- Cascade delete when user or character is removed

### Comments
User-generated content associated with characters.

**Features:**
- Supports anonymous and registered user comments
- Cascade delete when user or character is removed

### CronLogs
Audit trail for automated character synchronization jobs.

**Metrics Tracked:**
- Added/updated/deprecated character counts
- Execution duration
- Error details for troubleshooting
- Job status for monitoring


## Data Synchronization Strategy

1. **Initial Import**: Fetch all characters from Rick and Morty API
2. **Incremental Updates**: Use `last_imported_at` to sync only changes
3. **Deprecation**: Mark characters as `deprecated` if removed from API
4. **Soft Delete**: Use `is_active` to retain historical data
5. **Audit Logging**: Track all sync operations in `CronLogs`

## Notes

- All timestamps use UTC
- UUIDs are used for primary keys to prevent enumeration attacks
- JSONB fields enable flexible storage of API responses without schema changes
- Soft deletes preserve data integrity for historical favorites/comments