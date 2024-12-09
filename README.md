# Medical-Chain
MediChain is an innovative solution aimed at revolutionizing the healthcare preauthorization process using blockchain technology.
Project Description
MediChain is an innovative solution aimed at revolutionizing the healthcare preauthorization process using blockchain technology. This project addresses the inefficiencies and delays inherent in the traditional preauthorization process by leveraging the immutable and transparent nature of blockchain.

# Importance
The traditional healthcare preauthorization process is often cumbersome, slow, and prone to errors, leading to delays in patient care and increased administrative costs. By utilizing blockchain technology, the Preauth Project aims to streamline this process, providing a secure, transparent, and efficient system that benefits patients, healthcare providers, and insurance companies alike.

# Use Cases
Patient Management: Patients can submit preauthorization requests and track their status in real-time.
Healthcare Providers: Hospitals and clinics can manage patient records, submit requests, and receive approvals faster.
Insurance Companies: Insurance firms can efficiently manage and process preauthorization requests, reducing processing times and improving customer satisfaction.

# Advantages
Transparency: All transactions and operations are recorded on the blockchain, ensuring transparency for all parties involved.
Security: The use of blockchain technology ensures that data is immutable and secure from unauthorized modifications.
Efficiency: Automating the preauthorization process reduces the time and effort required, leading to faster approvals and better patient care.
Cost-Effective: Reduces administrative overhead and costs associated with the manual processing of preauthorizations.
Decentralization: Eliminates the need for a central authority, reducing the risk of data breaches and single points of failure.

# Key Components
Frontend: A React application that provides an intuitive interface for patients, healthcare providers, and insurance companies to interact with the system.
Backend: A Node.js server that handles user authentication, interacts with the PostgreSQL database, and communicates with the blockchain.
Smart Contracts: Solidity contracts deployed on the Ethereum blockchain using Truffle to manage healthcare preauthorization processes securely and transparently.

# Folder Structure
backend: Contains the Node.js server files.
contracts: Contains the Solidity smart contracts.
frontend: Contains the React application.
migrations: Contains the migration scripts for the smart contracts.
test: Contains test files for the smart contracts.
.gitignore: Specifies files and directories to be ignored by git.
README.md: This file.
truffle-config.js: Configuration file for Truffle.

# Project Layout
# Frontend
Uses React for the user interface.
Implements routing using react-router-dom.
Main components:
Admin: Admin layout.
Auth: Authentication layout.
Patient: Patient layout.
Insurance: Insurance company layout.

# Backend
Uses Express for the server.
Implements authentication using bcrypt and JWT.
Connects to a PostgreSQL database.
Main endpoints:
/api/register: Registers a new user.
/api/login: Logs in an existing user.
/api/insuranceCompanies: Retrieves a list of insurance companies.


# Smart Contracts
Written in Solidity.
Manages healthcare preauthorization processes.
Main contracts:
Cashless.sol
Main_Structure.sol
Migrations.sol
Patient_Management_System.sol
Reimbursement.sol

# How to Run
Prerequisites
Node.js
npm (Node Package Manager)
PostgreSQL
Truffle
Ganache (for local Ethereum blockchain)

# Frontend
1. Navigate to the frontend directory:

2. cd frontend
Install the required packages:

3. npm install
Start the React application:

npm start
The React application will be running on http://localhost:3000.

# Backend
Navigate to the backend directory:

cd backend
Install the required packages:

npm install
Start the Node.js server:

node server.js
The Node.js server will be running on http://localhost:3001.

# Smart Contracts
Navigate to the root directory of the project.

Install Truffle globally if you haven't already:

npm install -g truffle
Compile the smart contracts:

truffle compile
Deploy the smart contracts to your local blockchain (Ganache):

truffle migrate


# Database Setup
Make sure you have PostgreSQL installed and running.

Create a new PostgreSQL database:

createdb preauth
Connect to the database and create the necessary tables:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE insurancecompany (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL
);
Running Tests
To run tests for the smart contracts:

Navigate to the root directory of the project.

# Run the tests:

To run tests for the smart contracts:

1. Navigate to the root directory of the project.

2. Run the tests:

truffle test
