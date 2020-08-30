# Readme

### Quick Start

open a terminal in the project folder and type:

```
npm install
```

> Note: NodeJS must be installed to run the above command.

### Add a default.json file in config folder with the following

```
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>"
}
```

> Note: A mongoDB atlas account is required to run this application. 

### To start the project:

```
npm start
```

### Postman Routes and Screenshots:

1. **Create Ticket**<br>

  `POST http://localhost:4000/api/ticket`

  <img src='./images/create ticket.png' height='400px' width='auto'>

2. **Get all tickets**<br>
  
  `GET http://localhost:4000/api/ticket`

  <img src='./images/get all tickets.png' height='400px' width='auto'>  

3. **Update ticket timings**<br>
    
  `PUT http://localhost:4000/api/ticket/:ticket_id`

  <img src='./images/update ticket timing.png' height='400px' width='auto'>
  
4. **Delete ticket**<br>
  
  `DELETE http://localhost:4000/api/ticket/:ticket_id`

  <img src='./images/delete ticket.png' height='400px' width='auto'>

5. **Get all tickets for a particular time**<br>
  
  `GET http://localhost:4000/api/ticket/:time`

  <img src='./images/get all tickets by timing.png' height='400px' width='auto'>

6. **Get users details by ticket id**<br>

  `GET http://localhost:4000/api/ticket/user/:ticket_id`

  <img src='./images/get user detail by ticket id.png' height='400px' width='auto'>

### Cron-Job
To delete tickets automatically, cron-job has been used.
It automatically deletes old tickets from database and stores them in logs.txt file in log folder.
To achieve automatic deletion the timing entered by the user when creating a ticket, is first changed into javascript's date object, so that we can perform substraction on it, and is stored as show_time. Then we subtract 8 hours from current time and search for all tickets having show_time less than that.
