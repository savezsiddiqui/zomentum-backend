const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    timing: {
        type: String,
        required: true
    },
    show_date: {
        type: Date,
        required: true
    },
    date_booked: {
        type: Date,
        default: new Date()
    }
});

const Ticket = mongoose.model('ticket', TicketSchema);
module.exports = Ticket;