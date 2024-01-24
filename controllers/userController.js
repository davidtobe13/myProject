const myModel = require('../models/userModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res) =>{
    try{
        const {fullName, email, password} = req.body

        const userExists = await myModel.findOne({email})

        if(userExists){
            return res.status(400).json({
                message: `User with email: '${userExists.email}' already exists`
            })
        }

        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(password, salt)

        const user = await myModel.create({
            fullName,
            email,
            password: hash
        })

        res.status(201).json({
            message: `User with email: '${user.email}' created successfully`,
            user
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


exports.logIn = async (req, res) =>{
    try{
        const {email, password} = req.body
        const user = await myModel.findOne({email})

    if(!user){
        return res.status(404).json({
            message: `User not found`
        })
    }

    const pass = bcrypt.compareSync(password, user.password)

    if(pass === false){
        return res.status(400).json({
            message: `You entered an Invalid password`
        })
    }

    const token = jwt.sign({
        fullName: user.fullName,
        email: user.email,
        userId: user._id
    }, process.env.secret, {expiresIn: "1d"})

    res.status(200).json({
        message: `Login successful`,
        token,
        user
    })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await myModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'This user does not exist',
            });
        }

        const updatedScore = { ...user.score, ...req.body.score };

        const data = {
            fullName: req.body.fullName,
            score: updatedScore
        };

        const updatedUser = await myModel.findByIdAndUpdate(userId, data, { new: true });

        res.status(200).json({
            message: `User with email: ${updatedUser.email} has been updated successfully`,
            updatedUser
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};




exports.signOut = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await myModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: 'This user does not exist',
            });
        }
        const token = req.headers.authorization.split(' ')[1];
        user.blacklist.push(token)
        await user.save()

        res.status(200).json({
            message: 'User signed out successfully',
            user
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
