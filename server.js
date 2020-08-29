const express = require('express');
const connectDB = require('./config/db');
const cron = require('node-cron');
const Ticket = require('./model/ticket');
const ticketRouter = require('./api/ticket');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Using node-cron to delete expired tickets
// every 8 hours
cron.schedule("* * * * *", async () => {
    try {
        const result = await Ticket.find({ date: { $lt: new Date() - (8 * 60 * 60 * 1000) } });
        if (Array.isArray(result) && result.length > 0) {
            const pathtofile = path.resolve(__dirname, 'logs', 'logs.txt');
            const log = fs.createWriteStream(pathtofile, { flags: 'a' });

            log.write(JSON.stringify(result, undefined, 2) + '\n', (error) => {
                if (error) console.log(error.message);
            });
            log.end();

            await Ticket.deleteMany({ date: { $lt: new Date() - (8 * 60 * 60 * 1000) } });
            console.log('Old Tickets Deleted');
        }
    } catch (error) {
        console.log(error.message);
    }
});

// Initialize middlewares
app.use(express.json());
// Initialize Routes
app.use('/api/ticket', ticketRouter);

app.get('/', (req, res) => {
    res.send("Server Running");
})

app.listen(PORT, () => console.log(`Server stared at port ${PORT}`));