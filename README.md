
# OrgGrid - Connect & Lead Management Platform

OrgGrid is a comprehensive web application designed to track, manage, and visualize interactions between startups, corporates, and venture capitalists. It serves as a centralized CRM for managing deals (Connects), tracking potential opportunities (Leads), and maintaining a master database of organizations and stakeholders.

## Core Features

- **Connect Management**: Track the entire lifecycle of a deal, from "In Talks" to "Success Story," with a detailed activity timeline for every interaction.
- **Lead Tracking**: A dedicated module to manage and qualify potential leads before they become active connects.
- **Entity Database**: Maintain normalized records for Startups, Corporates, and individual Contacts (Stakeholders).
- **Real-time Data Sync**: All application data is persisted and synchronized in real-time with **Google Firebase Firestore**, ensuring data is always current across sessions.
- **User Authentication**: Secure user login and data scoping via Google Sign-In.
- **Full CRUD Operations**: Create, Read, Update, and Delete functionality for all major data types, with safeguards to prevent accidental deletion of linked records.
- **Advanced Table Features**: Modern data tables with robust searching, column sorting, and multi-record selection for bulk actions.
- **Data Portability**: Import data from CSV files and export current views back to CSV.
- **AI-Powered Insights (via Gemini API)**:
  - **Intelligent CSV Parsing**: The application uses the Gemini API to intelligently parse uploaded CSV files, mapping potentially mismatched headers to the correct data fields.
  - **Deal Summaries**: Generate concise summaries and actionable next steps for any connect based on its activity history.
  - **Industry Analysis**: Leverage Gemini with Google Search grounding to get market analysis and competitor information for any organization.
- **Analytics Dashboard**: A visual dashboard showcasing key performance indicators like active connects, success rates, average deal cycle times, and activity breakdowns.
- **Customizable Workflow**: Users can create, edit, and delete their own custom "Status" tags to match their specific workflow.

---

## Project Structure

The application follows a standard React project structure, separating concerns into distinct directories.

```
/
├── App.tsx                     # Main app component, handles authentication, routing, and modals.
├── index.tsx                   # React app entry point.
├── index.html                  # Main HTML file, loads TailwindCSS, Google Fonts, and scripts.
├── types.ts                    # Centralized TypeScript type definitions for the entire application.
├── constants.ts                # Initial sample data for seeding new user accounts.
├── utils.ts                    # General utility functions (e.g., CSV export helpers).
│
├── components/                 # Reusable UI components.
│   ├── layout/                 # Main layout components (Sidebar, TopBar, MasterToolbar).
│   ├── dashboard/              # Components specific to the Analytics Dashboard page.
│   ├── ConnectCard.tsx         # Card view for a single "Connect".
│   ├── ConnectsListView.tsx    # Table view for all "Connects".
│   ├── LeadsListView.tsx       # Table view for "Leads".
│   ├── EntityListView.tsx      # Generic, reusable list view for Organizations & Stakeholders.
│   ├── ActivityTimeline.tsx    # Renders the chronological list of activities for a connect.
│   ├── ...Modal.tsx            # All modal dialogs (ConnectModal, LeadModal, ErrorModal, etc.).
│   └── ...                     # Other smaller components (Button, Icons, Dropdowns, etc.).
│
├── contexts/                   # React Context for global state management.
│   └── AppContext.tsx          # The application's core logic and state manager.
│
├── pages/                      # Top-level page components rendered for each view.
│   ├── ConnectsPage.tsx        # Container for the main "Connects" view.
│   ├── LeadsPage.tsx           # Container for the "Leads" view.
│   ├── EntitiesPage.tsx        # Container for Startups, Corporates, and Stakeholders views.
│   ├── DashboardPage.tsx       # Container for the analytics dashboard.
│   └── ...                     # Other pages (Trash, SuccessStories, Admin, etc.).
│
├── services/                   # Modules for interacting with external APIs.
│   ├── firebase.ts             # Firebase configuration and authentication functions.
│   └── geminiService.ts        # All functions for interacting with the Google Gemini API.
│
└── README.md                   # This documentation file.
```

---

## Architecture & Data Flow

The application is built around a centralized state management pattern using React Context. This makes the data flow predictable and keeps components clean.

#### **`contexts/AppContext.tsx` - The Application Core**

This file is the most important in the project. It acts as the single source of truth for all application data and logic.

- **State Management**: Holds all global state, including data arrays (`connects`, `organizations`, etc.), UI state (`activeView`, `isLoading`, `isModalOpen`), and user session information.
- **Data Fetching**: Initializes real-time listeners to Firebase Firestore collections. When data changes in the database, the listeners automatically update the state, which triggers a re-render in the UI.
- **Business Logic**: Contains all functions for creating, updating, and deleting records. These functions (`saveConnect`, `deleteLead`, etc.) handle the communication with the Firestore backend.
- **Derived Data**: Uses `useMemo` to efficiently compute derived data structures (e.g., mapping entities by ID, calculating usage counts) that are needed by multiple components.
- **Actions**: Exposes a single `actions` object containing all the functions that can modify the state or interact with services. This object is passed down via the context.

#### **Component Interaction**

1.  **`App.tsx`**: The root component that wraps everything in `AppContextProvider`. It handles routing (based on the URL hash) and conditionally renders modals based on boolean flags in the context (e.g., `isConnectModalOpen`).
2.  **`pages/*.tsx`**: Page components act as containers. They use the `useAppContext` hook to get the `displayedData` (which is pre-filtered and sorted by the context) and pass it to the appropriate view component (e.g., `ConnectsListView`).
3.  **`components/**/*.tsx`**: These are primarily presentational components. They receive data and `actions` as props. For example, a "Delete" button in `ConnectCard.tsx` has an `onClick` handler that calls `actions.deleteConnect(id)`, which is defined in `AppContext.tsx`. The component itself doesn't know *how* to delete a connect, only that it needs to call the action.

#### **Example Data Flow: Deleting a Connect**

1.  **User Action**: The user clicks the trash icon on a connect in `ConnectCard.tsx`.
2.  **Action Call**: The `onClick` handler calls `actions.deleteConnect(connect.id)`.
3.  **Context Logic**: The `deleteConnect` function in `AppContext.tsx` is executed. It opens a confirmation modal. If the user confirms, the function updates the corresponding document in Firestore, setting a `deletedAt` timestamp.
4.  **Firestore Listener**: The real-time listener for the `connects` collection detects the change.
5.  **State Update**: The listener callback fires, fetching the updated collection and calling `setConnects(...)` with the new data.
6.  **React Re-render**: The state change in `AppContext` causes all subscribed components to re-render. The `useMemo` hook for `displayedData` re-runs, filtering out the connect that now has a `deletedAt` timestamp.
7.  **UI Update**: The `ConnectsPage` receives the new `displayedData` array, and the deleted connect card is no longer rendered.

---

## External Services Integration

#### **Firebase Firestore (`services/firebase.ts`)**

- **Role**: Serves as the primary backend database. It's a NoSQL, document-based database that provides real-time data synchronization.
- **Implementation**: All data (Connects, Leads, Organizations, Statuses, etc.) is stored in separate collections. Each document contains a `workspaceId` field, which is the `uid` of the logged-in user, ensuring data is partitioned and secure per user.
- **Authentication**: Firebase Authentication is used for Google Sign-In, managing user sessions securely.

#### **Google Gemini API (`services/geminiService.ts`)**

- **Role**: Provides AI capabilities that enhance the user experience.
- **Implementation**:
    - **`parseCsvData`**: Constructs a detailed prompt including the raw CSV text, context data (existing stakeholders, organizations), and a strict JSON schema. It calls the Gemini model with `responseMimeType: "application/json"` to get structured, validated data back, which is then used for batch-importing.
    - **`getConnectSummary`**: Sends the details of a connect (title, status, participants, and a full activity log) to the Gemini model and asks it to generate a professional summary and suggest next steps.
    - **`getIndustryInsights`**: Uses Gemini with Google Search grounding (`tools: [{ googleSearch: {} }]`). It prompts the model to perform a market analysis for a given company name. The response includes both the AI-generated analysis and the web sources it used.
