Pet Adoption System

Project Overview:
Pet Adoption System is a web application for managing and browsing pets available for adoption.
Admins can add, edit, and delete pets, upload images, while users can view pets, filter them by type, breed, or adoption status, and contact the admin.

Technologies used:
- Node.js and Express.js for backend
- MongoDB with Mongoose
- HTML, CSS, JavaScript for frontend
- JWT for authentication
- bcrypt for password hashing
- Multer for image uploads

Setup & Installation:
1. Clone the repository:
   git clone https://github.com/cpenkw/pet-adoption.git
   cd pet-adoption

2. Install dependencies:
   npm install

3. Create a .env file in the root directory:
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

4. Run the server:
   npm run dev

5. Access the application:
   - Admin panel: http://localhost:5000/admin
   - Client view: http://localhost:5000/client

API Documentation:

Authentication Routes (Public):
- POST /api/auth/register : Register a new user
- POST /api/auth/login : Authenticate user and receive JWT

User Routes (Private):
- GET /api/users/profile : Get logged-in user profile
- PUT /api/users/profile : Update user profile

Pet Routes:
- POST /api/pets : Admin only - Add a new pet
- POST /api/pets/upload : Admin only - Upload pet image
- GET /api/pets : Public - Get all pets
- GET /api/pets/:id : Public - Get single pet by ID
- PUT /api/pets/:id : Admin only - Update pet details
- DELETE /api/pets/:id : Admin only - Delete a pet

Features:
- JWT-based authentication with admin and user roles
- CRUD operations for pets
- Image upload support
- Filtering pets by type, breed, and status
- Form validation and error handling
- Responsive frontend

Deployment:
1. Push code to GitHub
2. Use hosting platforms like Render, Railway, or Replit
3. Set environment variables (PORT, MONGODB_URI, JWT_SECRET)
4. Ensure database is accessible
5. Verify API using Postman or frontend


