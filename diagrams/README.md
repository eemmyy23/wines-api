# C4 Architecture Diagrams for Wines API

This directory contains C4 architecture diagrams for the Wines API project using PlantUML notation.

## About C4 Model

The C4 model is a way to visualize software architecture at different levels of abstraction:

- **Level 1: System Context** - Shows the big picture of how the system fits into the world
- **Level 2: Container** - Zooms into the system to show the high-level technology choices
- **Level 3: Component** - Zooms into an individual container to show components
- **Level 4: Code** - Shows how components are implemented (optional, typically shown via IDE tools)

## Diagrams in this Project

### 1. System Context Diagram (`c4-context.puml`)

Shows the Wines API system and its relationship with users and external systems.

**Key Elements:**
- API Consumers (users, applications, services)
- Wines API System
- MongoDB Database

### 2. Container Diagram (`c4-container.puml`)

Shows the high-level technology stack and containers that make up the Wines API.

**Key Elements:**
- Restify Application (Node.js)
- MongoDB Database
- Communication protocols

### 3. Component Diagram (`c4-component.puml`)

Shows the internal components of the Restify application and how they interact.

**Key Components:**
- **Route Handler** (`serverRoutes.js`) - Maps HTTP endpoints
- **API Controller** (`APIwines.js`) - Handles CRUD operations
- **Wine Validator** (`WineValidator.js`) - Validates input data
- **Database Manager** (`db.js`) - Manages MongoDB connections
- **Data Formatter** - Transforms data between storage and display formats

## How to View the Diagrams

### Online Viewers

1. **PlantUML Online Server**
   - Visit: http://www.plantuml.com/plantuml/uml/
   - Copy and paste the content of any `.puml` file
   - Click "Submit" to generate the diagram

2. **PlantText**
   - Visit: https://www.planttext.com/
   - Paste the diagram code
   - View the rendered diagram

### Local Rendering

#### Using VS Code
1. Install the "PlantUML" extension
2. Open any `.puml` file
3. Press `Alt+D` (or `Option+D` on Mac) to preview

#### Using IntelliJ IDEA / WebStorm
1. Install the "PlantUML integration" plugin
2. Open any `.puml` file
3. The diagram will render in a preview pane

#### Using Command Line
```bash
# Install PlantUML
brew install plantuml  # macOS
apt-get install plantuml  # Ubuntu/Debian
choco install plantuml  # Windows

# Generate PNG images
plantuml diagrams/*.puml

# Generate SVG images
plantuml -tsvg diagrams/*.puml
```

## Architecture Overview

### Technology Stack
- **Runtime:** Node.js v6.2.0
- **Web Framework:** Restify 4.0.4
- **Database:** MongoDB 2.1.18
- **Validation:** validate.js 0.9.0

### Data Flow
1. API Consumer sends HTTP request
2. Route Handler receives and routes to appropriate controller
3. Controller validates input using Wine Validator
4. Controller formats data (year → timestamp)
5. Database Manager executes MongoDB operations
6. Controller formats response (timestamp → year)
7. Response sent back to consumer

### Key Design Patterns
- **Singleton Database Connection:** Single shared MongoDB connection
- **Data Transformation Layers:** Separate formatting for storage vs display
- **Promise-Based Async:** All operations use Promise chains
- **Separation of Concerns:** Clear boundaries between routing, validation, and business logic

## API Endpoints

- `GET /wines` - List all wines (with optional filters)
- `POST /wines` - Create a new wine
- `GET /wines/:id` - Retrieve a specific wine
- `PUT /wines/:id` - Update a wine
- `DELETE /wines/:id` - Delete a wine

## Database Schema

### wines collection
```javascript
{
  id: number,           // Auto-incrementing ID
  name: string,         // Wine name (min 3 chars)
  year_ts: timestamp,   // Year stored as Unix timestamp
  country: string,      // Country of origin (min 2 chars)
  type: string,         // Type: 'red', 'white', or 'rose'
  description: string   // Optional description (min 5 chars)
}
```

### counters collection
```javascript
{
  _id: "wines",         // Collection name
  seq: number           // Current sequence value
}
```

## References

- [C4 Model](https://c4model.com/)
- [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML)
- [PlantUML](https://plantuml.com/)
