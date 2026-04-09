# SimpleNotes

SimpleNotes is a small full-stack notes application built with Laravel for the backend API and React for the frontend UI. It supports creating, listing, updating, and deleting notes through a simple interface.

## Features

- Create new notes
- View all saved notes
- Edit existing notes
- Delete notes with confirmation
- Laravel API backend with SQLite database
- React frontend powered by Vite

## Tech Stack

- Backend: Laravel 13, PHP 8.3
- Frontend: React 19, Vite
- Database: SQLite
- HTTP client: Axios
- Styling: Custom CSS in the React app

## Project Structure

```text
SimpleNotes/
|- app/
|  |- Http/Controllers/NoteController.php
|- bootstrap/
|- config/
|- database/
|  |- migrations/
|- frontend/
|  |- src/App.jsx
|  |- src/App.css
|- routes/
|  |- api.php
|  |- web.php
|- README.md
```

## Requirements

- PHP 8.3 or newer
- Composer
- Node.js and npm

## Setup

### 1. Clone the project

```bash
git clone <your-repo-url>
cd SimpleNotes
```

### 2. Install backend dependencies

```bash
composer install
```

### 3. Create environment file

```bash
copy .env.example .env
php artisan key:generate
```

If you are not on Windows, use:

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Prepare the database

This project uses SQLite by default.

Create the database file if it does not exist:

```bash
type nul > database\database.sqlite
```

Then run migrations:

```bash
php artisan migrate
```

### 5. Install frontend dependencies

Root Vite dependencies:

```bash
npm install
```

React frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

## Running the App

You need to run the Laravel API and the React frontend separately.

### Terminal 1: Run Laravel

From the project root:

```bash
php artisan serve
```

The backend will usually be available at:

```text
http://127.0.0.1:8000
```

### Terminal 2: Run React

From the `frontend` folder:

```bash
cd frontend
npm run dev
```

The frontend will usually be available at:

```text
http://127.0.0.1:5173
```

## API Endpoints

Base URL:

```text
http://127.0.0.1:8000/api
```

Available endpoints:

- `GET /notes` - fetch all notes
- `POST /notes` - create a note
- `PUT /notes/{id}` - update a note
- `DELETE /notes/{id}` - delete a note

Example request body for create and update:

```json
{
  "title": "My note",
  "content": "This is the note content"
}
```

## Notes

- The current controller implementation is set up for a simple demo flow.
- Notes are currently tied to a fixed user id in the controller.
- If you want full authentication-based ownership, the next step is to replace the hardcoded user id with the authenticated user.
- If CORS issues appear during local development, make sure `config/cors.php` allows your frontend origin such as `http://127.0.0.1:5173`.

## Useful Commands

From the project root:

```bash
php artisan route:list
php artisan migrate
php artisan optimize:clear
php artisan test
```

From the frontend folder:

```bash
npm run dev
npm run build
npm run preview
```

## Future Improvements

- Add authentication and real user-based note ownership
- Add form validation and error messages
- Add search or filtering
- Add note timestamps in the UI
- Add pagination for larger datasets

## License

This project is open-sourced under the MIT license.
