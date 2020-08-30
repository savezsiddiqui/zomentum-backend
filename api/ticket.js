const express = require('express');
const router = express.Router();
const Ticket = require('../model/ticket');
const User = require('../model/user');
const { check, validationResult } = require('express-validator');


// @route   POST api/ticket
// @desc    create ticket
// @access  public

router.post('/', [
    check(
        'name',
        'Username is required'
    ).not().isEmpty(),
    check(
        'phone',
        'please enter a 10 digit phone number'
    ).isLength({ min: 10, max: 10 }),
    check(
        'timing',
        'Timing is required'
    ).not().isEmpty()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, phone, timing } = req.body;
        const tickets = await Ticket.find({ timing });
        if (tickets.length >= 20) {
            return res.status(400).json({ msg: 'No more tickets can be booked for this time slot' });
        }

        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ name, phone });
            await user.save();
        }

        const newTicket = {
            userid: user.id,
            timing,
            show: new Date(timing.split(' ').join('T') + 'Z')
        }

        const ticket = new Ticket(newTicket);
        await ticket.save();
        res.json(ticket);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/ticket
// @desc    get all tickets
// @access  public

router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find({}).sort({ booked: -1 });
        res.json(tickets);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

// @route   PUT api/ticket/:id
// @desc    update a tickets timing by id
// @access  public

router.put('/:id', [
    check(
        'timing',
        'Timing is required'
    ).not().isEmpty()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(400).json({ msg: 'ticket not found' });
        }
        const { timing } = req.body;
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    timing,
                    show: new Date(timing.split(' ').join('T') + 'Z')
                }
            },
            { new: true }
        );
        res.json(updatedTicket);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

// @route   DELETE api/ticket/:id
// @desc    delete a ticket
// @access  public

router.delete('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(400).json({ msg: 'ticket not found' });
        }
        await Ticket.findByIdAndRemove(req.params.id);
        res.send('Ticket Deleted');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

// @route   GET api/ticket/:time
// @desc    get tickets having timing 'time'
// @access  public

router.get('/:time', async (req, res) => {
    try {
        const tickets = await Ticket.find({ timing: req.params.time }).sort({ booked: -1 });
        res.json(tickets);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

// @route   GET api/ticket/user/:id
// @desc    get user details having ticket-id 'id'
// @access  public

router.get('/user/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(400).json({ msg: 'Ticket not found' });
        }
        const user = await User.findById(ticket.userid);
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;