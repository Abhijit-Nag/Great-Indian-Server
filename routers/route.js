const getProductById = require('../controller/productController');
const getProducts = require('../controller/productController');
const userLogin = require('../controller/userController');
const userSignup = require('../controller/userController');
const User = require('../models/User');
const product = require('../models/product');

const router= require('express').Router();

router.post("/signup", async(request, response)=>{
    try {
        const userCheck = await User.findOne({ $or: [{ username: request.body.username }, { email: request.body.email }] });
        if (!userCheck) {
            const newUser = await new User(request.body);
            const user=await newUser.save();
            console.log(user);

            response.status(200).json({ message: user });
        }
        else {
            if (userCheck.email == request.body.email ) {
                response.status(201).json('email already exists!!');
                console.log('email already exists!!');
            }
            else if (userCheck.username == request.body.username) {
                response.status(201).json('username already exists!!');
                console.log('username already exists!!');
            }
            else if (userCheck.username == request.body.username && userCheck.email == request.body.email) {
                response.status(201).json('username and email both exist!!');
                console.log('email and username both already exists!!');
            }
        }

    } catch (err) {
        response.status(500).json({ message: err });
        console.log('error while userSignUp api calling: ' + err);
    }
});
router.post("/login", userLogin);

router.get('/products', async(req, res)=>{
    try{
        const items= await product.find({});
        res.status(200).json(items);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

router.post('/signupgoogle', async(req, res)=>{
    try{
        let newUser= new User(req.body);
        newUser= await newUser.save();
        res.status(200).json(newUser);
    }catch(error){
        res.status(501).json({error: error.message});
    }
})

router.post("/logingoogle", async(req, res)=>{
    try{
        // const {email}= req.body;
        const user= await User.findOne({email:req.body.email});
        console.log(` email from firebase api : ${req.body.email}`);
        console.log(`user from firebase api : ${user}`)
        if(user){
            res.status(200).json({
                data:user,
                success:true});
        }
        else{
            res.status(200).json({success:false});
        }
    }catch(error){
        res.status(501).json({error:error.message});
    }
})
router.get('/product/:id', getProductById);

router.post("/getuser", async(req, res)=>{
    try{
        const email=req.body.email;
        const user= await User.findOne({email: email});
        res.status(200).json({userData: user}); 
    }catch(error){
        res.status(501).json({error: error.message});
    }
})

module.exports= router;