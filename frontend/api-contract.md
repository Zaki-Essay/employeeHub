# EmployeeHub - Backend API Contract

This document outlines the REST API contract for the EmployeeHub backend, designed to support the existing Angular frontend.

## Table of Contents
1.  [General Information](#1-general-information)
2.  [Authentication API (`/api/auth`)](#2-authentication-api-apiauth)
3.  [Users & Employees API (`/api/users`)](#3-users--employees-api-apiusers)
4.  [Projects API (`/api/projects`)](#4-projects-api-apiprojects)
5.  [Kudos & Recognition API (`/api/kudos`)](#5-kudos--recognition-api-apikudos)
6.  [Rewards API (`/api/rewards`)](#6-rewards-api-apirewards)
7.  [Roles API (`/api/roles`)](#7-roles-api-apiroles)
8.  [Tasks API (`/api/tasks`)](#8-tasks-api-apitasks)

---

## 1. General Information

### 1.1. Base URL

All API endpoints are prefixed with `/api`.
Example: `https://your-domain.com/api`

### 1.2. Authentication

*   Endpoints marked as `JWT Required` require a valid JSON Web Token to be passed in the `Authorization` header.
    *   `Authorization: Bearer <your_jwt_token>`
*   Endpoints marked as `Public` do not require authentication.

### 1.3. Standard Error Response

When an API call fails, the response body will contain a standard error object.

*   **Status Code:** `4xx` or `5xx`
*   **Content:**
    ```json
    {
      "timestamp": "2024-08-01T12:00:00.000Z",
      "status": 400,
      "error": "Bad Request",
      "message": "A detailed error message describing the issue.",
      "path": "/api/resource/endpoint"
    }
    ```

---

## 2. Authentication API (`/api/auth`)

**Spring Controller Suggestion:** `AuthController.java`

Handles user registration, login, and fetching the current user's profile.

### 2.1. Register User

*   **Endpoint:** `POST /api/auth/register`
*   **Description:** Creates a new user account.
*   **Authentication:** `Public`
*   **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "strong-password-123",
      "role": "Developer"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "message": "User registered successfully."
    }
    ```

### 2.2. Login User

*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Authenticates a user and returns a JWT.
*   **Authentication:** `Public`
*   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "strong-password-123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "accessToken": "ey...jwt_token..."
    }
    ```

### 2.3. Get Current User Profile

*   **Endpoint:** `GET /api/auth/me`
*   **Description:** Retrieves the complete profile of the currently authenticated user.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):** (Matches the `Employee` model from `src/models.ts`)
    ```json
    {
      "id": 1,
      "name": "Alex Johnson",
      "role": "Project Manager",
      "avatarUrl": "https://i.pravatar.cc/150?u=1",
      "kudosReceived": 125,
      "kudosBalance": 50,
      "kudosSent": 35,
      "projectAssignments": [
        { "projectId": 1, "role": "Project Manager" },
        { "projectId": 2, "role": "Project Manager" }
      ]
    }
    ```

---

## 3. Users & Employees API (`/api/users`)

**Spring Controller Suggestion:** `UserController.java`

Handles fetching and managing employee data.

### 3.1. Get All Users

*   **Endpoint:** `GET /api/users`
*   **Description:** Retrieves a list of all users/employees.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Alex Johnson",
        "role": "Project Manager",
        "avatarUrl": "https://i.pravatar.cc/150?u=1",
        "kudosReceived": 125,
        "kudosBalance": 50,
        "kudosSent": 35,
        "projectAssignments": []
      }
    ]
    ```

### 3.2. Update User Role

*   **Endpoint:** `PATCH /api/users/{userId}/role`
*   **Description:** Updates the primary role of a specific user. Requires admin privileges.
*   **Authentication:** `JWT Required` (Admin)
*   **Path Variables:**
    *   `userId` (number): The ID of the user to update.
*   **Request Body:**
    ```json
    {
      "newRole": "Senior Developer"
    }
    ```
*   **Response (200 OK):** The updated user object.
    ```json
    {
      "id": 2,
      "name": "Maria Garcia",
      "role": "Senior Developer",
      "avatarUrl": "https://i.pravatar.cc/150?u=2",
      "kudosReceived": 210,
      "kudosBalance": 50,
      "kudosSent": 80,
      "projectAssignments": []
    }
    ```

---

## 4. Projects API (`/api/projects`)

**Spring Controller Suggestion:** `ProjectController.java`

Handles CRUD operations for projects and their member assignments.

### 4.1. Get All Projects

*   **Endpoint:** `GET /api/projects`
*   **Description:** Retrieves a list of all projects.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Phoenix Initiative",
        "description": "Next-gen e-commerce platform migration."
      }
    ]
    ```

### 4.2. Create Project

*   **Endpoint:** `POST /api/projects`
*   **Description:** Creates a new project and sets its initial team members.
*   **Authentication:** `JWT Required`
*   **Request Body:**
    ```json
    {
      "name": "New Mobile App",
      "description": "A brand new mobile application.",
      "assignments": [
        { "employeeId": 2, "role": "Developer" },
        { "employeeId": 5, "role": "Business Analyst" }
      ]
    }
    ```
*   **Response (201 Created):** The newly created project object.
    ```json
    {
      "id": 4,
      "name": "New Mobile App",
      "description": "A brand new mobile application."
    }
    ```

### 4.3. Update Project

*   **Endpoint:** `PUT /api/projects/{projectId}`
*   **Description:** Updates a project's details and its team assignments.
*   **Authentication:** `JWT Required`
*   **Path Variables:**
    *   `projectId` (number): The ID of the project to update.
*   **Request Body:**
    ```json
    {
      "name": "Updated Project Name",
      "description": "Updated description.",
      "assignments": [
        { "employeeId": 3, "role": "Lead Developer" },
        { "employeeId": 4, "role": "Developer" }
      ]
    }
    ```
*   **Response (200 OK):** The updated project object.

### 4.4. Delete Project

*   **Endpoint:** `DELETE /api/projects/{projectId}`
*   **Description:** Deletes a project and all associated assignments.
*   **Authentication:** `JWT Required`
*   **Path Variables:**
    *   `projectId` (number): The ID of the project to delete.
*   **Response (204 No Content):** Empty response on success.

---

## 5. Kudos & Recognition API (`/api/kudos`)

**Spring Controller Suggestion:** `KudosController.java`

Handles kudos transactions and data feeds.

### 5.1. Send Kudos

*   **Endpoint:** `POST /api/kudos/send`
*   **Description:** Sends kudos from the authenticated user to another user. The backend must handle updating balances and streak bonuses.
*   **Authentication:** `JWT Required`
*   **Request Body:**
    ```json
    {
      "recipientId": 6,
      "amount": 20,
      "message": "Amazing work on the latest feature!"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Successfully sent 20 kudos! You got 2 kudos back for your 3-day streak! 🔥",
      "updatedSender": {
        "id": 1,
        "kudosBalance": 32,
        "kudosSent": 55,
        "...": "..."
      }
    }
    ```

### 5.2. Get Kudos Feed

*   **Endpoint:** `GET /api/kudos/feed`
*   **Description:** Retrieves the global, chronologically sorted kudos transaction feed.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "from": { "id": 2, "name": "Maria Garcia", "avatarUrl": "..." },
        "to": { "id": 6, "name": "Chloe Dubois", "avatarUrl": "..." },
        "amount": 20,
        "message": "Amazing work on the latest feature!",
        "timestamp": "2024-08-01T10:00:00.000Z"
      }
    ]
    ```

### 5.3. Get Kudos Leaderboard

*   **Endpoint:** `GET /api/kudos/leaderboard`
*   **Description:** Retrieves the top 5 users sorted by `kudosReceived`.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):** A sorted list of employee objects.
    ```json
    [
      {
        "id": 6,
        "name": "Chloe Dubois",
        "role": "Developer",
        "avatarUrl": "https://i.pravatar.cc/150?u=6",
        "kudosReceived": 300,
        "...": "..."
      }
    ]
    ```

---

## 6. Rewards API (`/api/rewards`)

**Spring Controller Suggestion:** `RewardController.java`

Handles the rewards shop.

### 6.1. Get All Rewards

*   **Endpoint:** `GET /api/rewards`
*   **Description:** Retrieves a list of all available rewards.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Coffee Shop Voucher",
        "description": "$10 voucher for your favorite coffee.",
        "cost": 50,
        "imageUrl": "https://picsum.photos/seed/coffee/400/300"
      }
    ]
    ```

### 6.2. Redeem Reward

*   **Endpoint:** `POST /api/rewards/{rewardId}/redeem`
*   **Description:** Allows the authenticated user to redeem a reward using their `kudosReceived` points.
*   **Authentication:** `JWT Required`
*   **Path Variables:**
    *   `rewardId` (number): The ID of the reward to redeem.
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "You have successfully redeemed \"Coffee Shop Voucher\"!",
      "updatedUser": {
        "id": 1,
        "kudosReceived": 75,
        "...": "..."
      }
    }
    ```

---

## 7. Roles API (`/api/roles`)

**Spring Controller Suggestion:** `RoleController.java`

Handles management of employee roles.

### 7.1. Get All Roles

*   **Endpoint:** `GET /api/roles`
*   **Description:** Retrieves a list of all available employee roles.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):**
    ```json
    [
      "Developer",
      "Business Analyst",
      "Project Manager",
      "QA Tester"
    ]
    ```

### 7.2. Create Role

*   **Endpoint:** `POST /api/roles`
*   **Description:** Adds a new custom role. Requires admin privileges.
*   **Authentication:** `JWT Required` (Admin)
*   **Request Body:**
    ```json
    {
      "roleName": "DevOps Engineer"
    }
    ```
*   **Response (201 Created):** The updated list of all roles.

### 7.3. Delete Role

*   **Endpoint:** `DELETE /api/roles`
*   **Description:** Deletes a custom role. The backend must validate that the role is not a default role and is not currently in use.
*   **Authentication:** `JWT Required` (Admin)
*   **Request Body:**
    ```json
    {
      "roleName": "DevOps Engineer"
    }
    ```
*   **Response (200 OK):** The updated list of all roles.

---

## 8. Tasks API (`/api/tasks`)

**Spring Controller Suggestion:** `TaskController.java`

Handles personal task management for the authenticated user.

### 8.1. Get User's Tasks

*   **Endpoint:** `GET /api/tasks`
*   **Description:** Retrieves all tasks for the authenticated user.
*   **Authentication:** `JWT Required`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "title": "Prepare Q3 presentation",
        "description": "Gather all project metrics and create slides.",
        "dueDate": "2024-08-10",
        "status": "In Progress"
      }
    ]
    ```

### 8.2. Create Task

*   **Endpoint:** `POST /api/tasks`
*   **Description:** Creates a new task for the authenticated user.
*   **Authentication:** `JWT Required`
*   **Request Body:**
    ```json
    {
      "title": "New Task Title",
      "description": "Optional description.",
      "dueDate": "2024-09-01"
    }
    ```
*   **Response (201 Created):** The newly created task object.

### 8.3. Update Task

*   **Endpoint:** `PUT /api/tasks/{taskId}`
*   **Description:** Updates a task's details, including its status.
*   **Authentication:** `JWT Required`
*   **Path Variables:**
    *   `taskId` (number): The ID of the task to update.
*   **Request Body:**
    ```json
    {
      "id": 1,
      "title": "Prepare Q3 presentation",
      "description": "Gather all project metrics and create slides.",
      "dueDate": "2024-08-10",
      "status": "Done"
    }
    ```
*   **Response (200 OK):** The updated task object.

### 8.4. Delete Task

*   **Endpoint:** `DELETE /api/tasks/{taskId}`
*   **Description:** Deletes a task for the authenticated user.
*   **Authentication:** `JWT Required`
*   **Path Variables:**
    *   `taskId` (number): The ID of the task to delete.
*   **Response (204 No Content):** Empty response on success.
```