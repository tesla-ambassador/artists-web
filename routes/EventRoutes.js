const express= require("express");
const router= express.Router();
const {getEvents,getEvent,createEvents,updateEvent,deleteEvent} = require("../controllers/EventController");
const validateToken = require("../middleware/validateTokenHandler");


router.use(validateToken);
router.route("/").get(getEvents).post(createEvents);

router.route("/:id").get(getEvent).put(updateEvent).delete(deleteEvent);

module.exports= router;