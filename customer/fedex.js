'use strict'


const faker = require('faker')
const io = require('socket.io-client');
const host = 'http://localhost:3000';
const supportConnection = io.connect(host);

supportConnection.on('closedTicketFedex', payLoad => {
console.log(`thank you for your patience you problom solved ${payLoad.orderId} `);
supportConnection.emit('closedTicketFedexReceved', payLoad)
})

setInterval(() => {
    let request =
    {
        company: 'Fedex',
        orderId: faker.datatype.uuid(),
        customer: faker.name.findName(),
        description: faker.commerce.productDescription(),
        contactInfo: faker.phone.phoneNumber(),
        time: new Date().toLocaleString()
    };
    console.log('i have ticket request to solve ');
    supportConnection.emit('openTickets', request);

}, 10000);