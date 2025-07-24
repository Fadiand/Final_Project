```
# VISTA Frontend – React App (CRA)

This folder contains the frontend of the **VISTA** project, built with **Create React App (CRA)**.  
It allows users to upload and classify images, fetch Instagram images by hashtag, submit feedback, log in via Google or Facebook, and view classification results.

---

## Folder Overview

- `src/components/` – Main components (Login, Gallery, ModelTest, etc.)
- `src/images/` – Image assets (logo, icons, etc.)
- `App.js`, `index.js` – App entry points
- `.env.local` – Environment variables (see below)

---

##  Environment Variables

Create a `.env.local` file in the root of the `frontend/` folder:

REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id  
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id  
REACT_APP_API_BASE_URL=http://localhost:8000

---

## Getting Started Locally

### 1. Clone the repository

git clone https://github.com/your-username/vista.git  
cd vista/frontend

### 2. Install dependencies

npm install

### 3. Run the development server

npm start

The app will be available at: http://localhost:3000

---

## Available Scripts

### npm start  
Runs the app in development mode at http://localhost:3000

### npm run build  
Builds the app for production to the `build/` folder.

### npm test  
Runs the test suite (if implemented).

---

## Features

- Upload and classify images using a deep learning model (VGG19)
- Login via Google and Facebook
- Fetch and classify Instagram images using Apify
- Submit feedback to improve model accuracy
- View model confidence score

---

## Tech Stack

- React (CRA)
- React Router DOM
- Axios
- Google Identity / Facebook SDK
- CSS Modules / Plain CSS

---
```
