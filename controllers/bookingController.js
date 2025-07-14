const asyncHandler = require('express-async-handler');
const Event = require('../models/EventModel');
const Booking = require('../models/BookingModel');

// Book seats for an event
const bookEvent = asyncHandler(async (req, res) => {
    const { eventId, userName, userEmail, seatsBooked } = req.body;

    if (!eventId || !userName || !userEmail || !seatsBooked) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    if (new Date(event.Date) < new Date()) {
        res.status(400);
        throw new Error('Cannot book seats for an event in the past');
    }

    if (event.availableSeats < seatsBooked) {
        res.status(400);
        throw new Error('Not enough seats available');
    }

    event.availableSeats -= seatsBooked;
    await event.save();

    const booking = await Booking.create({
        eventId,
        artistId: req.user.id,
        userName,
        userEmail,
        seatsBooked,
    });

    res.status(201).json(booking);
});

module.exports = { bookEvent };
