const asyncHandler =require("express-async-handler");
const Event = require("../models/EventModel");
//Get all event
//access private
//@route Get /api/Event
const getEvents =asyncHandler(async (req,res)=> {
    const event = await Event.find({user_id: req.user.id}); 
    res.status(200).json(event);
  });

//create new event
//access private
//@route POST /api/Event
const createEvents =asyncHandler(async(req,res)=> {
    console.log("The request body is:",req.body);
    const{name,location,Date} = req.body
    if(!name || !location || !Date){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const event = await Event.create({
        name,
        location,
        Date,
    });
    res.status(201).json(event);
  });

//Get event
//access private
//@route Get /api/Event/:id
const getEvent =asyncHandler(async(req,res)=> {
    const event =await Event.findById(req.params.id);
    if(!event){
        res.status(404)
        throw new Error("Event not found");
    }
    res.status(200).json(event);
  });

//Update event
//acess private
//@route PUT /api/Event/:id
const updateEvent=asyncHandler(async(req,res)=> {
    const event =await Event.findById(req.params.id);
    if(!event){
        res.status(404)
        throw new Error("Event not found");
    }
    if (event.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("Unauthorized")
    }
    const updateEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updateEvent);
  });

//Delet event
//access private
//@route DELETE /api/Event/:id

const deleteEvent=asyncHandler(async(req,res)=> {
    const event =await Event.findById(req.params.id);
    if(!event){
        res.status(404)
        throw new Error("Event not found");
    }
    if (event.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("Unauthorized")
    }
    await Event.deleteOne({_id:req.params.id});
    res.status(200).json(event);
  });



module.exports = {
    getEvents,
    createEvents,
    getEvent,
    updateEvent,
    deleteEvent};