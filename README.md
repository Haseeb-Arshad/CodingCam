# CodingCam - Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

CodingCam is a web application designed to help developers visualize and track their coding activity. This repository contains the frontend code for the CodingCam dashboard, a user-friendly interface that displays data collected by the CodingCam extension (available separately).  The dashboard provides insights into your coding habits, project progress, and even offers a global view of coding activity.

## Features

*   **Dashboard:**  A central hub displaying key coding metrics, including total coding time, active projects, and recent activity, all beautifully visualized with interactive charts.
*   **Reports:** Detailed breakdowns of coding sessions, filterable by date range, project, and programming language.
*   **Leaderboard:**  A gamified view of coding activity, ranking users (anonymously if desired) based on their coding time, adding a fun, competitive element.
*   **Project Management:**  Dedicated sections to manage individual projects, track time spent, and monitor progress.
*   **Goal Setting:**  Set personal coding goals and track your progress towards achieving them.
*   **Global Progress Map:** A visually engaging 3D map showcasing aggregated, anonymized coding activity from around the world.
*   **User Profile and Settings:**  Customize your profile, adjust application preferences, and manage notification settings.
*   **Insights:** (Coming Soon) Personalized recommendations and observations based on your coding patterns.
*   **Teams:** (Future Feature) Collaborate and track coding activity within teams.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **Vite.js:** A fast build tool that significantly improves the frontend development experience.
*   **TypeScript:** A superset of JavaScript that adds static typing, enhancing code quality and maintainability.
*   **React Router:** A library for handling navigation and routing within the application.
*   **UI Component Library**: Provides pre-built, customizable UI components for a polished and consistent user experience.
*  **Styling:** `@progress/kendo-theme-default/dist/all.css`.

## Getting Started

These instructions will get you a copy of the frontend project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js:** (v16 or higher recommended) Download and install Node.js from [nodejs.org](https://nodejs.org/).
*   **npm:** (or yarn) npm is typically installed with Node.js. You can also use yarn as an alternative package manager.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>  # Replace <repository_url> with the actual URL
    cd codingcam
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the root directory of the project. This file will store environment variables, such as API endpoints.  You'll need to configure this file to connect to your backend. Example:

    ```
    VITE_API_BASE_URL=http://localhost:3001/api # Replace with your backend URL
    ```
   *Make sure to replace the example `VITE_API_BASE_URL` with the actual URL of your backend server.*

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    This will start the development server, typically on `http://localhost:5173` (or a similar port).  Open your browser and navigate to that URL to view the application.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
