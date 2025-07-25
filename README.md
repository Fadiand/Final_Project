# VISTA – Visual Identification of Significant Travel Attractions

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)

## Introduction

VISTA is a full-stack web application that classifies images as **"Tourism" or "Not Tourism"** using a deep learning model (VGG19).  
It allows users to upload and classify images, search Instagram by hashtags and more.

The system includes a React frontend, Django backend, TensorFlow model, and integrations with Instagram (via Apify) Google login and facebook.

## Project Overview

This project consists of three main components:

1. **Backend**:  
   the backend is built with Django and Django REST Framework. It handles user authentication (Google login), image uploads, model classification, and feedback submission.

2. **Frontend**:  
   A React application. It allows users to interact with the classification model and upload or fetch images

3. **Machine Learning Model**:  
   A TensorFlow-based VGG19 model trained on Instagram city datasets (InstaCities100K + custom city-specific images). The model predicts whether an image is tourism-related with a confidence score.

Each folder has its own README file with development instructions.

## Key Features

- **Image Classification**: Upload or fetch images and classify them as tourism or not using a VGG19 CNN model.
- **Instagram Hashtag Search**: Automatically pulls public images by hashtag using Apify.
- **Google Login**: OAuth2 login with custom Django session handling.
- **Active Learning**: Users can submit feedback on incorrect classifications to improve the model.

## Prerequisites

- Python 3.8+ installed on your system
- A trained VGG19 `.h5` model file located in the `vista-model/` folder
- An Apify token (for Instagram scraping)
- A Google Cloud project for OAuth login (Client ID + Secret)
- A Facebook Developer App (App ID)

