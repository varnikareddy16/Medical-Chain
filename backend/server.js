const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  { Pool } = require('pg');

const app = express();
const port = 3001; 

// Database connection 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/api/register',async(req,res)=>{
    const { username, email, password ,role} = req.body;
        // Insert user into the database
        try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
        
            // Insert user into the database
           const result = await pool.query(
                'INSERT INTO users (username, email, password_hash,role) VALUES ($1, $2, $3,$4) RETURNING *',
                [username, email, hashedPassword,role] 
            );
            
        
            res.json(result.rows[0]); 
          } catch (err) {
            console.log(err);
            if (err.code === '23505') { // Unique constraint violation
              if (err.constraint === 'users_username_key') {
                res.status(400).send({ error: 'Username already exists' }); 
              } else if (err.constraint === 'users_email_key') {
                res.status(400).json({ error: 'Email already exists' });
              } else {
                res.status(500).json({ error: 'Registration failed' }); // Unexpected error
              }
            } else {
               res.status(500).json({ error: 'Registration failed' }); // General handling
            }
          }

});


app.post('/api/login',async(req,res)=>{
  const{username,password}=req.body;
  try{
        // Check if user exists in the database
    const user= await pool.query('Select * from users where username=$1',[username]);
    if(user.rows.length===0){
      return res.status(400).json({error:'Invalid username'})
    }
        // Verify password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

       // Return user data without sensitive information 
       const userData = {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        role: user.rows[0].role,
     };
     res.json(userData);
    } catch (error) {
      console.error('Login failed:', error);
      res.status(500).json({ error: 'Login failed' });
    }
})

app.get('/api/insuranceCompanies', async (req, res) => {
  const result = await pool.query('SELECT * FROM insurancecompany;');
  res.json(result.rows);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });