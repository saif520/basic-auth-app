const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const userRoutes=require('./routes/userRoutes');

const app=express();

const PORT=process.env.PORT||3000;
const DB_URL=process.env.DB_URL;

//Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api',userRoutes);

//Connect to MongoDB
mongoose.connect(DB_URL).then(() =>
     console.log('Database Connected Successfully')
).catch((err) => {
    console.error('Database Connection Error:', err);
    process.exit(1);
});


app.get('/',(req,res)=>{
    res.send("Server is Running");
})


app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
})