'use strict'

const PORT = process.env.PORT || 3000;

const supportCenter = require('socket.io')(PORT);

const messageQueue = {
    openTickets: {},
    closedTickets: {}
}

supportCenter.on('connection', (socket) => {


    socket.on('openTickets', payLoad => {
        if (payLoad.company === 'Fedex') {
            messageQueue.openTickets[payLoad.orderId] = payLoad;
            console.log({
                event: 'openTickets from fedex company',
                payLoad: payLoad.orderId
            });
            supportCenter.emit(`openTicketsFedex`, payLoad)
        } else {
            messageQueue.openTickets[payLoad.orderId] = payLoad;
            console.log({
                event: 'openTickets from aramix company',
                payLoad: payLoad.orderId
            });
            supportCenter.emit(`openTicketsAramix`, payLoad)
        }
    })

    socket.on('recevedOpenTicket', payLoad => {
        console.log('waiting for confirmation the open ticket from worker ++++++++', messageQueue.openTickets[payLoad.orderId].orderId);
        delete messageQueue.openTickets[payLoad.orderId]
        console.log('ticket received and been process from workers 🛑🛑🛑🛑🛑🛑🛑', messageQueue.openTickets[payLoad.orderId]);
    })

    socket.on('closedTicketAramix', payLoad => {
        messageQueue.closedTickets[payLoad.orderId] = payLoad;
        console.log({
            event: 'closed Tickets from aramix',
            payLoad: payLoad.orderId
        });
        supportCenter.emit('closedTicketAramix', payLoad);
    })

    socket.on('closedTicketFedex', payLoad => {
        messageQueue.closedTickets[payLoad.orderId] = payLoad;
        console.log({
            event: 'closed Tickets from fedex',
            payLoad: payLoad.orderId
        });
        // console.log( messageQueue.closedTickets);
        supportCenter.emit('closedTicketFedex', payLoad);
    })

    socket.on('closedTicketAramixReceved', payLoad => {
        console.log('closed ticket list ++++++++', messageQueue.closedTickets[payLoad.orderId].orderId);
        Object.keys(messageQueue.closedTickets).forEach(id => {
            console.log(`${messageQueue.closedTickets[id].orderId} ${messageQueue.closedTickets[id].company}`);
        })
        // delete messageQueue.closedTickets[payLoad.orderId]
        // console.log('after delete closed ticket 🛑🛑🛑🛑🛑🛑🛑', messageQueue );
    })

    socket.on('closedTicketFedexReceved', payLoad => {
        console.log('closed ticket list ++++++++', messageQueue.closedTickets[payLoad.orderId].orderId);
        Object.keys(messageQueue.closedTickets).forEach(id => {
            console.log(`${messageQueue.closedTickets[id].orderId} ${messageQueue.closedTickets[id].company}`);
        })
        // console.log('after delete closed ticket 🛑🛑🛑🛑🛑🛑🛑', messageQueue );
    })

    socket.on('getAll', ()=>{
        Object.keys(messageQueue.openTickets).forEach(id =>{
            if (messageQueue.openTickets[id].company === 'aramex') {                
                socket.emit('openTicketsAramix', messageQueue.openTickets[id] )
            }else {
                socket.emit('openTicketsFedex', messageQueue.openTickets[id] )
            }
        })
    })

})
