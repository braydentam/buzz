const Buzz = require('../models/buzzModel')

const createBuzz = async (req, res) => {
    const { message } = req.body
    if(!message){
        return res.status(400).json("Please enter a message")
    }
    try {
        const user_id = req.user._id
        const buzz = await Buzz.create({user_id, message})
        res.status(200).json(buzz)
      } catch (error) {
        res.status(400).json({error: error.message})
      }
}

const getAllBuzz = async (req, res) => {
    const buzz = await Buzz.find({}).sort({createdAt: -1})
    res.status(200).json(buzz)
}
module.exports = { createBuzz, getAllBuzz }