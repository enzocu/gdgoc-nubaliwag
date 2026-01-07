# GDSC Website

This project is a React application built with Vite, utilizing Firebase for backend services (Authentication, Firestore, Storage). It features a public-facing user interface and a protected admin dashboard for managing events, members, and photos.

## Project Structure

```
gdscwebsite/
├── public/
│   ├── assets/
│   │   ├── images/       # Static images
│   │   └── json/         # Lottie JSON animations
│   ├── banner.png
│   └── vite.svg
│
├── src/
│   ├── lib/
│   │   ├── firebase/     # Firebase interactions
│   │   │   ├── delete/   # Deletion logic
│   │   │   ├── get/      # Fetching logic
│   │   │   ├── insert/   # Insertion logic
│   │   │   ├── update/   # Update logic
│   │   │   ├── handleLogin.js
│   │   │   └── handleLogout.js
│   │   └── helper/       # Utility functions (date formatting, modal handlers, etc.)
│   │
│   ├── provider/         # React Context Providers
│   │   ├── acadyearProvider.jsx
│   │   ├── alertProvider.jsx
│   │   ├── loadingProvider.jsx
│   │   ├── protectedRoute.jsx
│   │   └── userProvider.jsx
│   │
│   ├── server/
│   │   └── firebaseConfig.js  # Firebase configuration
│   │
│   ├── style/            # CSS Stylesheets
│   │   ├── adminStyle/   # Styles for Admin Dashboard
│   │   ├── bootstrapStyle/ # Custom Bootstrap overrides
│   │   ├── userStyle/    # Styles for Public Pages
│   │   └── index.css     # Global styles
│   │
│   ├── view/             # React Components & Pages
│   │   ├── adminPages/   # Admin Dashboard Pages & Forms
│   │   │   ├── details/
│   │   │   ├── forms/
│   │   │   └── ...
│   │   ├── components/   # Reusable Components (Headers, Footers, Loaders)
│   │   │   ├── boostrap/ # Specific Bootstrap-based components
│   │   │   └── ...
│   │   ├── userPages/    # Public Pages (Home, Events, Contact)
│   │   │   ├── details/
│   │   │   └── ...
│   │   └── App.jsx       # Main App Component
│   │
│   └── main.jsx          # Entry Point
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Tech Stack

- **Frontend:** React, Vite
- **Styling:** CSS, Bootstrap 5
- **Backend:** Firebase (Firestore, Auth, Storage)
- **Deployment:** Vercel (configured via vercel.json)

## Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run Development Server:**

    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```
