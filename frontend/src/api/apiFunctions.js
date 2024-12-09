import axios from "axios";

export async function registerUser(userData) {
  try {
    const response = await axios.post('http://localhost:3001/api/register', userData);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.status === 400) { 
       console.error('Registration failed:', error.response.data.error); 
    } else {
      console.error('Registration failed:', error);
    }

    throw error; 
  }
}

export async function loginUser(userData) {
  try {
    const response = await axios.post('http://localhost:3001/api/login', userData);
    return response.data; 
  } catch (error) {
    console.error('Login failed:', error);
    throw error; 
  }
}

export async function getInsuranceCompanies(){
  try {
    const response = await axios.get('http://localhost:3001/api/insuranceCompanies');
    console.log(response)
    return response.data; 
  } catch (error) {
    console.error('Error fetching insurance companies:', error);
    throw error; 
  }
}