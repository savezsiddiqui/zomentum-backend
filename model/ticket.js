const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    timing: {
        type: String,
        required: true
    },
    show: {
        type: Date
    },
    booked: {
        type: Date,
        default: new Date()
    }
});

const Ticket = mongoose.model('ticket', TicketSchema);
module.exports = Ticket;