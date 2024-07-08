import express from 'express';
import { config  } from 'dotenv';
config();
import app from './app.js';
import connectDb from './Config/dbConn.js';


const PORT = process.env.PORT || 5000

app.listen(PORT , async () => {
    console.log(`App is runnig at http://localhost:${PORT}`);
    await connectDb()
})