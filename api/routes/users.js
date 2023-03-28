const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')

router.post("/signup", (req,res,next)=>{
    bcrypt.hash(req.body.uuid, 10, (err, hash)=>{
        if (err) {
            console.log(req.body)
            return res.status(500).json({
                error: err
            })
        }else{
            const user = User({
                
                _id : new mongoose.Types.ObjectId,
                email : req.body.email,
                uuid: hash
            })
            user.save()
                .then(retult => {
                    res.status(201).json({
                        message: 'User Created'
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error:err
                    })
                })
        }
    })
    // const body = {
        // message:"hello"
    // }
    // res.status(200).json(body);
})

module.exports = router