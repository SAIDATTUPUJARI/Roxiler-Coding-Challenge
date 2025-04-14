# Store Rating Application

A full-stack web application for users to rate and review stores.

---

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)  
- [MySQL](https://www.mysql.com/) (v8+ recommended)  
- [Git](https://git-scm.com/) (optional)

---

## 📦 1. Clone the Repository

```bash
git clone https://github.com/your-username/store-rating-app.git
cd store-rating-app
⚙️ 2. Backend Setup
Install dependencies
bash
Copy
Edit
cd backend
npm install
Database Configuration
Create a MySQL database:

sql
Copy
Edit
CREATE DATABASE store_ratings;
Copy and edit environment variables:

bash
Copy
Edit
cp .env.example .env
Update .env:

env
Copy
Edit
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=store_ratings
JWT_SECRET=your_jwt_secret_key
PORT=5000
Initialize Database
bash
Copy
Edit
mysql -u your_username -p store_ratings < database/schema.sql
Start Backend Server
bash
Copy
Edit
npm start         # Production
npm run dev       # Development with nodemon
🌐 3. Frontend Setup
Install dependencies
bash
Copy
Edit
cd ../frontend
npm install
Configure Environment
bash
Copy
Edit
cp .env.example .env
Update .env:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000/api
Start Frontend Server
bash
Copy
Edit
npm run dev
🚀 4. Access the Application
Open your browser:
👉 http://localhost:5173

🌱 First-Time Setup (Optional)
To populate the database with sample data:

bash
Copy
Edit
mysql -u your_username -p store_ratings < database/seed.sql
📜 Available Scripts
Backend
npm start – Start production server

npm run dev – Start dev server with nodemon

npm test – Run backend tests

Frontend
npm run dev – Start frontend dev server

npm run build – Create production build

npm run preview – Preview production build

📁 Project Structure
pgsql
Copy
Edit
store-rating-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── server.js
│   └── .env
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── vite.config.js
🧩 Troubleshooting
Database Issues
Ensure MySQL is running

Check .env for correct DB credentials

Test DB connection:

bash
Copy
Edit
mysql -u your_username -p
Port Conflicts
Backend runs on 5000

Frontend runs on 5173

Change ports in .env files if needed

CORS Issues
Ensure backend allows CORS

Verify frontend makes requests to correct API base URL

JWT Issues
Check token is sent in Authorization header

Ensure JWT_SECRET matches in both backend and frontend

📦 Deployment Notes
For production:
Set NODE_ENV=production in backend .env

Build frontend:
bash
Copy
Edit
cd frontend
npm run build
Use Nginx/Apache to serve frontend
Use PM2 to manage backend process:
bash
Copy
Edit
npm install -g pm2
pm2 start backend/server.js
📚 API Documentation
Auth Routes
POST /api/auth/signup – Register new user

POST /api/auth/login – User login

GET /api/auth/user – Get current logged-in user

PUT /api/auth/update-password – Update password

Store Routes
GET /api/stores – Get all stores

GET /api/stores/search – Search for stores

POST /api/stores/:id/rate – Rate a specific store

📬 Support
For help or suggestions, open an issue or contact:
📧 pujarisaidattu6@gmail.com
