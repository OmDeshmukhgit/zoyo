# Zomato-Style Restaurant Explorer

Full-stack TypeScript application inspired by Zomato. The project demonstrates live search, advanced filtering, rich UI built with Tailwind CSS, and a Node.js + MongoDB API layer.

## ✨ Features

- **Real-time search** with debounced input and smooth scrolling to results.
- **Combinational filters** (cuisine, location, price range, rating) with shareable URL query parameters.
- **Custom dropdowns** and modern Tailwind styling to match Zomato’s UI.
- **Add restaurant workflow** with success states and form validation.
- **JWT authentication** with protected API routes, login/logout UI, and auto-refresh on add/delete.
- **Skeleton loaders & spinners** for better perceived performance.
- **Robust API error handling** with retries and user-facing error messages.

## 🧱 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **State/UX utilities**: React Router, custom hooks, custom dropdown component

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local or cloud)

### Environment Variables

Create a `.env` file inside `server/`:

```
MONGO_URI=mongodb://localhost:27017/zomato
JWT_SECRET=supersecret
JWT_EXPIRES_IN=7d
PORT=5000
```

### Installation

```bash
git clone <repo-url>
cd Zomato

# Install server deps
cd server
npm install

# Install client deps
cd ../client
npm install
```

### Running Locally

#### Backend API

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

Open `http://localhost:5173` to view the app.

## 🧪 Testing (Recommended)

Add unit/integration tests with:

- **Jest + React Testing Library** for UI
- **Vitest** (optional) for Vite-native testing
- **Supertest/Jest** for backend routes

Run tests (placeholder):

```bash
npm test
```

## 🧭 Project Structure (Client)

```
client/
 ├── src/
 │   ├── components/     # UI building blocks (SearchBar, FilterBar, CustomSelect, Skeletons)
 │   ├── hooks/          # Reusable hooks (e.g., useDebounce)
 │   ├── pages/          # Route-level components (Home, RestaurantDetails)
 │   ├── services/       # API clients
 │   └── types/          # Shared TypeScript types
```

## 📝 Notes

- Ready for enhancement with authentication (JWT/OAuth) for user reviews, favorites, etc.
- The codebase is structured to extend easily (add Redux/React Query if needed).
- Documented custom components (CustomSelect, SkeletonList) provide reusable patterns.

---



