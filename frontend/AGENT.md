# AGENT.md: AI-Assisted Development Guide for EmployeeHub

This document provides essential information for AI agents to understand, maintain, and extend the EmployeeHub application.

## 1. Project Overview

*   **Project Name:** EmployeeHub
*   **Purpose:** A modern web application for managing employees, projects, and recognition with a gamified feel. It includes features for sending kudos, redeeming rewards, and viewing analytics dashboards.

## 2. Technology Stack

*   **Frontend:**
    *   **Framework:** Angular (v20+)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS (via CDN)
    *   **State Management:** Angular Signals
    *   **Architecture:** Standalone Components, Zoneless Change Detection
*   **Backend:**
    *   The backend is currently simulated. All business logic is handled within Angular services.
*   **Database:**
    *   Data persistence is simulated using the browser's `localStorage`. Key data like employees, roles, and tasks are saved locally.

## 3. Key Features & Logic

*   **Notifications:** Real-time notifications (e.g., for kudos) are simulated by logging messages to the console, which represents a webhook or pub/sub integration with a service like Microsoft Teams. The `NotificationService` handles user-facing toast messages.

## 4. Code Structure (Frontend)

The frontend source code is located in the `src/` directory and follows a standard Angular component-based architecture.

*   `src/app.component.ts`: The root component of the application, managing the main layout and navigation between different views.
*   `src/components/`: Contains all UI components, each focused on a specific feature or view (e.g., `dashboard`, `employees`, `projects`).
*   `src/services/`: Contains singleton services for managing application state and business logic.
    *   `data.service.ts`: The primary service for managing all core data (employees, projects, kudos).
    *   `notification.service.ts`: Handles the display of toast notifications to the user.
    *   `theme.service.ts`: Manages the light/dark mode theme.
    *   `badge.service.ts`: Contains the logic for awarding badges to employees based on their stats.
    *   `role.service.ts`: Manages available employee roles, including custom ones.
    *   `task.service.ts`: Manages user tasks.
*   `src/models.ts`: Defines all TypeScript interfaces and types for the application's data models.
*   `index.html`: The main HTML file, which includes the Tailwind CSS CDN script and the root application component.
*   `index.tsx`: The entry point for bootstrapping the Angular application.

## 5. Development Workflow

*   **Running the Application:** This is an Applet project that runs within a sandboxed environment. There are no local build steps or `npm install` commands required. Simply modify the source files, and the environment will reflect the changes.
*   **Backend/Database:** No separate backend or database server needs to be run. All data is mock data or stored in `localStorage`, making the app self-contained.

## 6. AI Development Guidelines

When adding new features or modifying existing code, please adhere to the following principles:

*   **Clean & Maintainable Code:** Follow Angular and TypeScript best practices. Keep components small and focused on a single responsibility.
*   **Reusable Components:** Encapsulate UI and logic into standalone components that can be reused across the application.
*   **State Management:** Use Angular Signals for all state management. Use `computed()` signals for derived state. Avoid placing complex logic in templates.
*   **Responsive UI:** Ensure all new UI elements are fully responsive and work well on various screen sizes using Tailwind CSS's responsive utility classes (e.g., `md:`, `lg:`).
*   **Accessibility (a11y):** Build with accessibility in mind. Use semantic HTML, provide appropriate ARIA attributes, and ensure keyboard navigability.
*   **Styling:** Use Tailwind CSS utility classes exclusively for styling. Do not add custom CSS files unless absolutely necessary for complex, non-utility-based styling like keyframe animations.
