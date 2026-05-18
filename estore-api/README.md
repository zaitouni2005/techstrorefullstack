# E-Store API

A robust Spring Boot backend for a modern E-Commerce platform, following a domain-driven layered architecture.

## 🚀 Technologies
- **Java 21** & **Spring Boot 3.x**
- **Security:** Spring Security + JWT Authentication
- **Databases:**
  - **MySQL:** Primary relational data (Users, Products, Orders, etc.)
  - **MongoDB:** Document storage for Product Reviews
- **Documentation:** Swagger UI / OpenAPI 3
- **Tools:** Lombok, Maven, Docker

## 🏗️ Architecture
The project is organized into functional domains:
- **Customer:** Authentication, User Profiles, and Roles.
- **Catalog:** Products, Categories, and Brands.
- **Inventory:** Stock management.
- **Shopping:** Cart and Cart Items.
- **Billing:** Orders, Shipping, and Dashboard statistics.
- **Review:** Product reviews (stored in MongoDB).

## 🛠️ Getting Started

### Prerequisites
- JDK 21
- MySQL 8.0
- MongoDB
- Maven 3.x (or use the included `./mvnw`)

### Database Setup
1. Create a MySQL database named `estoredb`.
2. Ensure MongoDB is running (default port 27017).

### Configuration
Update `src/main/resources/application.properties` with your database credentials if they differ from the defaults:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Application
```bash
# Clone the repository
git clone <repository-url>

# Run with Maven
./mvnw spring-boot:run
```
The API will be available at `http://localhost:9090`.

### Running with Docker
If you prefer Docker, a `docker-compose.yml` is provided to spin up the API, MySQL, and MongoDB:
```bash
docker-compose up -d
```

## 📚 API Documentation
Once the app is running, you can explore the interactive API documentation at:
- **Swagger UI:** [http://localhost:9090/swagger-ui.html](http://localhost:9090/swagger-ui.html)

## 🧪 Seeding Data
The application automatically seeds data on startup:
- **MySQL:** Seeds are located in `src/main/resources/data.sql`.
- **MongoDB:** Reviews are seeded via `com.estore.config.DataSeeder`.

## 🔒 Default Credentials (Development)
- **Admin:** `admin@estore.com` / `admin123`
- **User:** `user@estore.com` / `user123`
