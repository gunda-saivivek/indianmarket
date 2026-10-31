# 🎯 The Market Sniper Shooters - Enterprise Spring Boot Backend

A production-grade, enterprise backend architecture built strictly in compliance with the **Common Technology and Architecture Requirements** using **Spring Boot 3**, **Spring Security 6 (Stateless JWT)**, **Spring Data JPA**, and **MySQL / Embedded H2 Relational Database**.

---

## 🏛️ Layered Architecture Pattern

```
Postman / React Client
        │
        ▼  (HTTP REST / Bearer JWT)
┌───────────────────────────────────────────────┐
│              REST Controllers                 │
│  - AuthController (/api/auth/**)              │
│  - AdminController (/api/admin/**)            │
│  - MarketDataController (/api/market/**)      │
└───────────────────────┬───────────────────────┘
                        │  (Constructor Injection / DTOs)
                        ▼
┌───────────────────────────────────────────────┐
│               Service Layer                   │
│  - AuthService                                │
│  - UserService                                │
│  - MarketDataService                          │
│  - UserDetailsServiceImpl                     │
└───────────────────────┬───────────────────────┘
                        │  (Constructor Injection / Entities)
                        ▼
┌───────────────────────────────────────────────┐
│          Spring Data JPA Repositories         │
│  - UserRepository (JpaRepository)             │
│  - RoleRepository (JpaRepository)             │
└───────────────────────┬───────────────────────┘
                        │  (Hibernate ORM / JDBC)
                        ▼
┌───────────────────────────────────────────────┐
│             Relational Database               │
│  - Primary Keys & Foreign Keys                │
│  - Unique Constraints                         │
│  - MySQL / Embedded H2                        │
└───────────────────────────────────────────────┘
```

---

## 🔒 Security Best Practice: Stateless JWT Authentication

### Why Stateless JWT + BCrypt was Chosen as the Optimal Security Model:
1. **Stateless Scalability**: Unlike traditional session cookies that require sticky sessions or distributed Redis session stores, JWT tokens are cryptographically signed using HMAC SHA-256 (`Keys.hmacShaKeyFor`). The server does not maintain server-side session state, enabling seamless horizontal clustering.
2. **Strict Role-Based Access Control (RBAC)**: Enforced via Spring Security `SecurityFilterChain` and `@PreAuthorize("hasRole('ADMIN')")`. Customers and standard employees are strictly prohibited from invoking administrative APIs (`/api/admin/**`), returning `403 Forbidden`.
3. **Defense Against CSRF**: Storing tokens in client memory and transmitting them via the standard `Authorization: Bearer <token>` header eliminates Cross-Site Request Forgery (CSRF) vulnerabilities inherent to browser cookie storage.
4. **Strong Password Cryptography**: Passwords are mathematically hashed with `BCryptPasswordEncoder(12)`, applying adaptive cryptographic salts to prevent rainbow table attacks.

---

## 📋 Technology & Requirement Compliance Matrix

| Requirement | Implementation Details | File Location |
|---|---|---|
| **Spring Core** | Inversion of Control (IoC), Dependency Injection via Constructor Injection, Stereotypes (`@Service`, `@Repository`, `@Component`, `@Configuration`). | All classes in `services/`, `repositories/`, `config/` |
| **Spring Boot** | Auto-configuration, embedded Tomcat server, `application.properties`, executable fat JAR build. | `pom.xml`, `application.properties`, `MarketSniperApplication.java` |
| **Spring MVC / REST** | `@RestController`, `@GetMapping`, `@PostMapping`, `@DeleteMapping`, Path Variables (`@PathVariable`), Request Bodies (`@RequestBody`), Request/Response DTOs, proper HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`). | `controllers/AuthController.java`, `controllers/AdminController.java`, `controllers/MarketDataController.java` |
| **Spring Data JPA** | Relational Entities (`User`, `Role`), `@ManyToMany` with `@JoinTable`, `JpaRepository<User, Long>`, derived queries (`findByEmail`, `existsByEmail`). | `entities/User.java`, `entities/Role.java`, `repositories/UserRepository.java` |
| **Spring Security** | Stateless JWT authentication, `SecurityFilterChain`, `BCryptPasswordEncoder(12)`, `OncePerRequestFilter`, Role-Based Access Control (`ROLE_ADMIN`, `ROLE_USER`). Regular users blocked from admin endpoints. | `config/SecurityConfig.java`, `config/JwtAuthTokenFilter.java`, `config/JwtUtils.java` |
| **Relational Database** | Primary keys (`@Id @GeneratedValue`), foreign keys (`fk_user`, `fk_role`), unique constraints on `email` and `role_name`. Dual profiles: Embedded H2 and MySQL. | `resources/schema.sql`, `application.properties`, `application-mysql.properties` |
| **Validation** | Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Pattern`, `@Size`) + Custom business rule validation + `@RestControllerAdvice` Global Exception Handler returning structured JSON error maps. | `dto/request/`, `exceptions/GlobalExceptionHandler.java` |
| **Deliverables** | Full source code, database DDL/DML, executable JAR, README, cURL/Postman API documentation, automated test suite with 100% pass rate. | Complete `backend-spring/` folder |

---

## 🔑 Default Credentials

### 1. Master Administrator
- **Email**: `gsv.200000@gmail.com`
- **Password**: `Money@2027#`
- **Role**: `ROLE_ADMIN`
- **Access**: Full platform administrative clearance, user approvals/rejections, member deletion, system metrics.

### 2. Standard User (Self-Registration)
- **Constraint**: Must use a valid `@gmail.com` address.
- **Initial Status**: `PENDING` (Pending Admin approval before live trading features activate).
- **Role**: `ROLE_USER`

---

## 🚀 How to Run the Spring Boot Backend

### Option A: Direct JAR Execution (Recommended)
Prerequisites: Java 17+ (Java 25 verified).
```cmd
cd backend-spring
java -jar target\market-sniper-backend-1.0.0.jar
```
Or simply double-click `run.bat` (or execute `run.ps1` in PowerShell).

### Option B: Build & Run from Source using Maven
```cmd
cd backend-spring
"C:\Users\Koushik Patha\eclipse-workspace\springcore\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
```

The application starts on port `8080`:
- **API Base URL**: `http://localhost:8080`
- **H2 Browser Database Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:marketsniperdb`
  - User: `sa`
  - Password: `password`

---

## 🗄️ Database Profiles: H2 vs MySQL

### 1. Embedded H2 Relational Database (Default)
Active out of the box with zero configuration required. All tables and initial seeds (`ROLE_ADMIN`, `ROLE_USER`, and Master Admin) are provisioned automatically on launch.

### 2. Production MySQL Database
To switch to local or cloud MySQL:
1. Ensure MySQL is running on port 3306.
2. Run the application with the `mysql` profile:
```cmd
java -jar -Dspring.profiles.active=mysql target\market-sniper-backend-1.0.0.jar
```
Or update `application.properties`:
```properties
spring.profiles.active=mysql
```
Configuration is defined in `src/main/resources/application-mysql.properties`.

---

## 📡 API Reference & Postman / cURL Documentation

### 1. User Registration (Request Access)
- **Method**: `POST`
- **Endpoint**: `/api/auth/signup`
- **Authentication**: None (Public)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Arjun Kumar",
  "email": "arjun.kumar@gmail.com",
  "password": "Password@123"
}
```
- **Validation Rules**:
  - `name`: Not blank, between 2 and 100 characters.
  - `email`: Not blank, valid email format, strictly matching `^[A-Za-z0-9._%+-]+@gmail\.com$`.
  - `password`: Not blank, minimum 6 characters.
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Access request registered successfully. Your account is pending Administrator review.",
  "data": {
    "id": 2,
    "name": "Arjun Kumar",
    "email": "arjun.kumar@gmail.com",
    "status": "PENDING",
    "roles": ["ROLE_USER"]
  }
}
```

---

### 2. User Authentication (Login)
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Authentication**: None (Public)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "gsv.200000@gmail.com",
  "password": "Money@2027#"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Authentication successful. Institutional workspace granted.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3YuMjAwMDAwQGdtYWlsLmNvbSIsInJvbGVzIjoiUk9MRV9BRE1JTiJ9...",
    "type": "Bearer",
    "id": 1,
    "name": "Sai Vivek (Admin)",
    "email": "gsv.200000@gmail.com",
    "status": "APPROVED",
    "roles": ["ROLE_ADMIN"]
  }
}
```

---

### 3. Get Current User Identity
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Authentication**: `Bearer <JWT_TOKEN>`
- **Response**: `200 OK`

---

### 4. Admin - List All Users & Approvals (Admin Only)
- **Method**: `GET`
- **Endpoint**: `/api/admin/users`
- **Authentication**: `Bearer <JWT_TOKEN>` (User MUST have `ROLE_ADMIN`)
- **Security Check**: Returns `403 Forbidden` if called by regular users or unauthenticated clients.
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "All users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Sai Vivek (Admin)",
      "email": "gsv.200000@gmail.com",
      "status": "APPROVED",
      "roles": ["ROLE_ADMIN"]
    },
    {
      "id": 2,
      "name": "Arjun Kumar",
      "email": "arjun.kumar@gmail.com",
      "status": "PENDING",
      "roles": ["ROLE_USER"]
    }
  ]
}
```

---

### 5. Admin - Approve, Reject, or Delete User
- **Method**: `POST`
- **Endpoint**: `/api/admin/action`
- **Authentication**: `Bearer <JWT_TOKEN>` (User MUST have `ROLE_ADMIN`)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "arjun.kumar@gmail.com",
  "action": "approve"
}
```
*(Valid actions: `approve`, `reject`, `delete`)*
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "User arjun.kumar@gmail.com action 'approve' executed successfully.",
  "data": {
    "id": 2,
    "name": "Arjun Kumar",
    "email": "arjun.kumar@gmail.com",
    "status": "APPROVED",
    "roles": ["ROLE_USER"]
  }
}
```

---

### 6. Admin - Platform Metrics
- **Method**: `GET`
- **Endpoint**: `/api/admin/stats`
- **Authentication**: `Bearer <JWT_TOKEN>` (`ROLE_ADMIN`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Platform administration statistics retrieved",
  "data": {
    "totalUsers": 2,
    "pendingApproval": 0,
    "approved": 2,
    "rejected": 0
  }
}
```

---

### 7. Live Market Quotes & Breadth
- **Method**: `GET`
- **Endpoint**: `/api/market/live-data`
- **Authentication**: Public
- **Response**: `200 OK` (Live indices for NIFTY 50, BANK NIFTY, FIN NIFTY, SENSEX, INDIA VIX, USD/INR, CRUDE OIL, GOLD, and institutional breadth advances/declines).

---

## 🧪 Automated Testing & Verification

The test suite validates:
- IoC Container initialization and stereotyping
- Stateless JWT generation and claims signature parsing
- Jakarta validation rejection of non-`@gmail.com` registrations
- Spring Security authorization blocking standard users (`ROLE_USER`) from accessing `/api/admin/**` with `403 Forbidden`
- Master Admin login and token verification

Run the tests anytime:
```cmd
"C:\Users\Koushik Patha\eclipse-workspace\springcore\apache-maven-3.9.9\bin\mvn.cmd" test
```
**Test Results**: `9 tests run, 0 failures, 0 errors, 0 skipped` (100% Success).
