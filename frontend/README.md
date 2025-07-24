# 📸 VISTA Frontend – React App (CRA)

This folder contains the frontend of the **VISTA** project, built with **Create React App (CRA)**.  
It allows users to upload and classify images, fetch Instagram images by hashtag, submit feedback, log in via Google or Facebook, and view classification results.
```
------------------------------------------------------------

## 📁 Folder Overview

- src/components/ – Main components (Login, Gallery, ModelTest, etc.)
- src/images/ – Image assets (logo, icons, etc.)
- App.js, index.js – App entry points
- .env.local – Environment variables (see below)

------------------------------------------------------------

## ⚙️ Environment Variables (.env.local)

REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id  
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id  
REACT_APP_API_BASE_URL=http://localhost:8000

------------------------------------------------------------

## 🛠️ Getting Started Locally

1. Clone the repository:

   git clone https://github.com/your-username/vista.git  
   cd vista/frontend

2. Install dependencies:

   npm install

3. Start the development server:

   npm start

Visit: http://localhost:3000

------------------------------------------------------------

## 📜 Available Scripts

npm start       → Run app in development mode  
npm run build   → Build app for production (output to build/)  
npm test        → Run test suite (if implemented)

------------------------------------------------------------

## 🌟 Features

- Upload and classify images using a deep learning model (VGG19)
- Login via Google and Facebook
- Fetch and classify Instagram images using Apify
- Play a "Guess the Tourism" game
- Submit feedback to improve model accuracy
- View classification confidence score

------------------------------------------------------------

## 🧠 Tech Stack

- React (CRA)  
- React Router DOM  
- Axios  
- Google Identity / Facebook SDK  
- Standard CSS

------------------------------------------------------------
## ✍️ Author

Fadi Andrawis  
B.Sc. Computer Science, 2025  
Sami Shamoon College of Engineering (SCE)
