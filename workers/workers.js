'use strict'

const io = require('socket.io-client');
const host = 'http://localhost:3000';
const supportConnection = io.connect(host);

supportConnection.emit('getAll');


supportConnection.on(`openTicketsAramix`, (payLoad) => {

    console.log(`receved openTicket from aramix ${payLoad.orderId}`);
    supportConnection.emit('recevedOpenTicket', payLoad)
    
    setTimeout(() => {
        console.log(`solved the ticket from aramex : ${payLoad.orderId}`);
        supportConnection.emit('closedTicketAramix', payLoad)
    }, 2000)

})

supportConnection.on(`openTicketsFedex`, (payLoad) => {

    console.log(`receved  openTicket from Fedex ${payLoad.orderId}`);
    supportConnection.emit('recevedOpenTicket', payLoad)    
    setTimeout(() => {
        console.log(`solved the ticket from fedex : ${payLoad.orderId}`);
        supportConnection.emit('closedTicketFedex', payLoad)
    }, 2000)

})