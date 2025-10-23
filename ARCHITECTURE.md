# Wines API Architecture

A simple REST API for managing a wine catalog, built with Node.js and MongoDB.

## System Overview

```
┌─────────────────┐
│  API Consumers  │ (Developers, Apps, Services)
│                 │
└────────┬────────┘
         │ HTTPS/JSON
         ↓
┌─────────────────┐
│   Wines API     │ (Node.js + Restify)
│                 │
└────────┬────────┘
         │ MongoDB Protocol
         ↓
┌─────────────────┐
│    MongoDB      │ (Database)
│                 │
└─────────────────┘
```

## Technology Stack

- **Runtime:** Node.js v6.2.0
- **Web Framework:** Restify 4.0.4
- **Database:** MongoDB 2.1.18
- **Validation:** validate.js 0.9.0

## Application Components

```
┌────────────────────────────────────────────────────────┐
│                  Restify Application                   │
│                                                        │
│  ┌──────────────┐                                     │
│  │Route Handler │  Maps HTTP endpoints                │
│  │serverRoutes  │                                     │
│  └──────┬───────┘                                     │
│         │                                             │
│         ↓                                             │
│  ┌──────────────┐       ┌───────────────┐            │
│  │API Controller│◄─────►│Wine Validator │            │
│  │  APIwines    │       │WineValidator  │            │
│  └──────┬───────┘       └───────────────┘            │
│         │                                             │
│         ↓                                             │
│  ┌──────────────┐       ┌───────────────┐            │
│  │Data Formatter│       │Database Mgr   │            │
│  │format/display│       │     db.js     │            │
│  └──────────────┘       └───────┬───────┘            │
│                                 │                     │
└─────────────────────────────────┼─────────────────────┘
                                  │
                                  ↓
                         ┌────────────────┐
                         │    MongoDB     │
                         │ wines/counters │
                         └────────────────┘
```

## API Endpoints

| Method | Endpoint      | Description              |
|--------|---------------|--------------------------|
| GET    | /wines        | List all wines (filterable) |
| POST   | /wines        | Create new wine          |
| GET    | /wines/:id    | Get specific wine        |
| PUT    | /wines/:id    | Update wine              |
| DELETE | /wines/:id    | Delete wine              |

## Data Model

### Wine Object
```javascript
{
  "id": 1,                              // Auto-increment ID
  "name": "Cabernet Sauvignon",         // Required, min 3 chars
  "year": 2013,                         // Required, 350 - current year
  "country": "France",                  // Required, min 2 chars
  "type": "red",                        // Required: red/white/rose
  "description": "Excellent wine..."    // Optional, min 5 chars
}
```

### Database Collections

**wines** - Stores wine records
```javascript
{
  id: number,           // Custom sequential ID
  name: string,
  year_ts: timestamp,   // Year stored as Unix timestamp
  country: string,
  type: string,
  description: string
}
```

**counters** - Manages auto-increment IDs
```javascript
{
  _id: "wines",         // Collection name
  seq: number           // Current sequence
}
```

## Request Flow

```
1. HTTP Request
   ↓
2. Route Handler (serverRoutes.js)
   ↓
3. API Controller (APIwines.js)
   ↓
4. Wine Validator (WineValidator.js) - Validates input
   ↓
5. Data Formatter - Converts year → timestamp
   ↓
6. Database Manager (db.js) - Gets connection
   ↓
7. MongoDB Operation - Insert/Update/Query
   ↓
8. Data Formatter - Converts timestamp → year
   ↓
9. HTTP Response (JSON)
```

## Key Features

- **Auto-incrementing IDs**: Custom sequential IDs instead of MongoDB ObjectIds
- **Data Transformation**: Years stored as timestamps internally, returned as years
- **Input Validation**: Schema-based validation with detailed error messages
- **Singleton DB Connection**: Single shared MongoDB connection
- **Promise-based**: All async operations use Promises
- **RESTful Design**: Standard HTTP methods and status codes

## File Structure

```
wines-api/
├── index.js              # Server entry point
├── package.json          # Dependencies
├── app/
│   ├── serverRoutes.js   # Route definitions
│   ├── APIwines.js       # CRUD controllers
│   ├── WineValidator.js  # Validation logic
│   └── db.js             # DB connection manager
├── test/
│   ├── test.js           # Integration tests
│   └── testData/
│       └── wines.js      # Test fixtures
└── diagrams/             # C4 architecture diagrams
    ├── c4-context.puml
    ├── c4-container.puml
    ├── c4-component.puml
    └── README.md
```

## Error Handling

**Validation Error Example:**
```json
{
  "error": "VALIDATION_ERROR",
  "validation": {
    "year": "INVALID",
    "country": "MISSING"
  }
}
```

## Environment Configuration

Required environment variables:
- `MONGO_URL` - MongoDB connection string
- `PORT` - Server port number

## Testing

Run tests with: `npm test`
- Uses Mocha + Chai + Chai-HTTP
- Full integration tests for all endpoints
- Validates CRUD operations and error cases
