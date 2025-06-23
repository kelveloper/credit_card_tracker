# The Ledger - Credit Card Tracker

A personal credit card tracking application with a handwritten notebook aesthetic.

## Features

- Manual credit card debt tracking
- Monthly ledger views
- Notebook-style interface
- Add debt and pay off functionality
- Automatic total calculation
- Last updated timestamps

## Setup

### Backend (Python Flask)
1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the backend server:
   ```
   python backend/app.py
   ```

### Frontend (React)
1. Install Node.js dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

The app will be available at http://localhost:3000

## Architecture

- **Frontend**: React with styled-components for the notebook aesthetic
- **Backend**: Flask with SQLite database
- **Database**: SQLite with credit card ledger data stored monthly 