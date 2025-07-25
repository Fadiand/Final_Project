# 🔙 VISTA Backend – Django Project

This folder contains the backend of the **VISTA** project, built using **Django**.  
It provides the API for image upload/classification, Instagram scraping, user authentication via Google/Facebook, and feedback submission.

---

## Folder Structure

- backend/ – Django project root (settings, urls, wsgi)
- gallery/ – Image upload, storage, and classification logic
- instagram/ – Fetch Instagram images by hashtag (Apify integration)
- connectgmail/ – Google login integration via OAuth
- connectfacebook/ – Facebook login integration via OAuth
- signup_app/ – User registration and authentication logic
- media/images/ – Uploaded image files
- requirements.txt – Python dependencies
- manage.py – Django CLI entry point

---

## ⚙️ Environment Variables (.env)

Create a .env file in the root of the backend/ folder and include the following variables:

#Instagram Scraper
INSTAGRAM_SESSIONID=your-instagram-session-id
APIFY_API_TOKEN=your-apify-token

#Email Settings (for sending feedback or notifications)
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-password

#Facebook OAuth
FACEBOOK_KEY=your-facebook-app-id
FACEBOOK_SECRET=your-facebook-app-secret

#Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

>  These values are loaded in settings.py using os.environ.get("VAR_NAME")  
> ⚠ Never push .env to GitHub – make sure it's in .gitignore


##  Running Locally

1. Create virtual environment & activate:
python -m venv venv  
source venv/bin/activate  # or venv\Scripts\activate on Windows


2. Install requirements:
pip install -r requirements.txt


3. Run migrations:
python manage.py migrate


4. Start server:
python manage.py runserver


API runs on: [http://localhost:8000](http://localhost:8000)

---

## API Endpoints Overview

- POST /api/upload/ – Upload and classify image  
- GET /api/images/ – Get uploaded images  
- POST /api/feedback/ – Submit user feedback  
- POST /api/google-auth/ – Google login  
- POST /api/facebook-auth/ – Facebook login  
- POST /api/instagram/ – Fetch Instagram images by hashtag  

---
