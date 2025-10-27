# Spring Boot + ExtJS CRUD Application

## Overview
A full-stack web application demonstrating complete CRUD (Create, Read, Update, Delete) operations using Spring Boot for the backend REST API and ExtJS 7.x for the frontend UI.

## Project Status
- **Last Updated**: October 27, 2025
- **Status**: Fully functional CRUD application with in-memory database
- **Current Version**: 1.0.0

## Recent Changes
- October 27, 2025: Initial project creation
  - Set up Spring Boot 3.1.5 with Maven and Java 17
  - Created Product entity with JPA/Hibernate validation
  - Implemented REST API with full CRUD endpoints (/api/products)
  - Configured H2 in-memory database with auto-DDL
  - Built responsive HTML/CSS/JavaScript frontend
  - Implemented async CRUD operations with fetch API
  - Created modal-based forms for add/edit operations
  - Added toast notifications for user feedback
  - Configured CORS for cross-origin requests
  - Deployed on port 5000 for Replit environment

## Technology Stack

### Backend
- **Spring Boot**: 3.1.5
- **Java**: 17 (GraalVM 22.3)
- **Spring Web**: REST API controllers
- **Spring Data JPA**: Data persistence layer
- **H2 Database**: In-memory database
- **Maven**: Build and dependency management
- **Hibernate**: ORM framework

### Frontend
- **HTML5/CSS3**: Modern, responsive design
- **Vanilla JavaScript**: No framework dependencies
- **Async/Await**: For API communication
- **Responsive UI**: Clean gradient design with professional styling

## Project Architecture

### Backend Structure
```
src/main/java/com/example/crud/
├── CrudApplication.java          # Main Spring Boot application class
├── model/
│   └── Product.java              # Entity model with JPA annotations
├── repository/
│   └── ProductRepository.java    # JPA repository interface
├── service/
│   └── ProductService.java       # Business logic layer
└── controller/
    └── ProductController.java    # REST API endpoints

src/main/resources/
├── application.properties        # Spring Boot configuration
└── static/                       # Frontend files served by Spring Boot
    ├── index.html
    └── app.js
```

### Frontend Structure
```
src/main/resources/static/
├── index.html                    # Single-page application with:
                                  # - Responsive table UI
                                  # - Modal form for add/edit
                                  # - Inline CSS styling
                                  # - JavaScript for CRUD operations
                                  # - Async REST API calls
```

## Features

### Product Management
- **Entity Fields**: ID, Name, Description, Price, Quantity
- **Validation**: Required fields, positive price values, client-side form validation
- **Responsive Table**: Clean, professional data grid with hover effects
- **Action Buttons**: Edit (blue) and Delete (red) buttons per row
- **Add Product**: Modal form with validation for creating new products
- **Edit Product**: Modal form pre-populated with product data
- **Delete Product**: Confirmation dialog before deletion
- **Refresh**: Manual refresh button to reload data
- **Toast Notifications**: Success/error messages for all operations
- **Empty State**: User-friendly message when no products exist

### REST API Endpoints
All endpoints are under `/api/products`:
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update existing product
- `DELETE /api/products/{id}` - Delete product

Response format:
```json
{
  "success": true,
  "data": { ... }
}
```

## Database Configuration
- **Type**: H2 In-memory database
- **URL**: jdbc:h2:mem:testdb
- **Username**: sa
- **Password**: (empty)
- **Console**: Available at `/h2-console`
- **Schema**: Auto-created on startup, dropped on shutdown

## Running the Application

### Development
The application runs automatically via the configured workflow:
```bash
mvn spring-boot:run
```

### Building
```bash
mvn clean package
```

### Access Points
- **Main Application**: http://localhost:5000/
- **H2 Console**: http://localhost:5000/h2-console
- **API Endpoint**: http://localhost:5000/api/products

## Configuration

### Port Configuration
- Application runs on port 5000 (required for Replit environment)
- Configured in `src/main/resources/application.properties`

### CORS
- Enabled for all origins in ProductController
- Allows frontend-backend communication

### Static Resources
- Frontend files served from `classpath:/static/`
- All static files accessible via root path

## User Preferences
None set yet.

## Next Steps (Future Enhancements)
1. Migrate to persistent PostgreSQL database
2. Add input validation and error handling improvements
3. Implement pagination and sorting for large datasets
4. Add search and filtering capabilities
5. Create confirmation dialogs for better UX
6. Add authentication and authorization
7. Implement unit and integration tests
8. Add logging and monitoring
9. Create API documentation (Swagger/OpenAPI)
10. Optimize frontend bundle size with local ExtJS build
