import User from "../Models/userMode.js";
import AppError from "../Utility/errorUtil.js";

//Cookis setUp

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //& days
    httpOnly: true,
    secure: true
}

//Regsiter/SignUp
const register = async (req,res,next) => {
    const {fullname,email,password}= req.body;
    if(!fullname || !email || !password){
        return next(new AppError('All Fields are required For Registration',400));
    }
    const userExits = await User.findOne({email})

    if(userExits) {
        return next(new AppError('Email already exists',409))
    }
    const user = await User.create({
        fullname,
        email,
        password,
        avater: {
            public_id: email,
            secure_url: ''
        }
    });
    if(!user){
        return next(new AppError('User Registretion failed ! Please Try Again',400))
    }

    //Todo => File Upload

    await user.save();
    user.password = undefined;

    const token = await user.generateJWTToken()

    res.cookie('token',token,cookieOptions)

    res.status(201).json({
        success: true,
        message: 'User Register Successfully',
        user
    })
}

//Login
const login = async (req,res) => {
    try {
        const {req,res} = req.body;
    if(!email || !password){
        return next(new AppError('All Fields are required',400));
    }

    const user = await User.findOne({
        email
    }).select('+password')

    if(!user || !user.comparePasssword(password)){
        return next(new AppError('Email Or Password Does Not Match',400));
    }

    const token = await user.generateJWTToken()
    user.password = password
    res.cookie('token',token,cookieOptions)

    res.status(200).json({
        success: true,
        messgae: 'User Loggedin Successfully',
        user
    })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

//Get User
const getuser = async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
        res.status(200).json({
            success: true,
            message: 'User Details',
            user
        })
    } catch (e) {
       return next(new AppError('Failed to Fetch Details',500))
    }
}

//Logout
const logout = (req,res) => {
    res.cookie('token',null,{
        secure: true,
        maxAge: 0,
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User Logged Out Successfully'
    })
}

export {
    register,
    login,
    getuser,
    logout
}
