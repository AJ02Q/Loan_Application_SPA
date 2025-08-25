# Loan Application SPA


## Disclaimer
   I do not in any way, shape, or form declare that all of this work is completely mine.
   I have used online resources, snippets from other people’s code, and the help of AI to get this SPA working.


## This is a single page application for a branch manager to manage loan applications.
## Features
   - Login and Logout (only `branch_manager` can access the app)
   - View and filter loan applications by status (Pending, Approved, Rejected)
   - Add new loan applications (each application has a unique number)
   - Approve or reject pending applications


## Setup
1) **Backend**  
   cd ../backend
   npm install
   npm run seed   # creates database with test user + sample loans
   npm run dev    # runs backend on http://localhost:4000
   
   The DB will auto-initialize with a test user and demo loans.

2) **Frontend**  
   cd ../frontend
   npm install
   npm run dev    # Open the URL printed in your terminal.

3) **Login**  
      **Username:** `manager@branch.local`  
      **Password:** `Passw0rd!`


## Architecture
See `architecture.pdf` for the architecture diagram.


## Future additions
   - Creating a friendlier UI.
   - Proper user registration and role management
   - Role based access
   - Editing loan applications
   - Deleting loan applications
   - Adding a search system
