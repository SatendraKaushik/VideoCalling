const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // Broadcast the message to all clients except the sender
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                if (typeof message === 'string') {
                    client.send(message);
                }
            }
        });
    });
});

console.log('Signaling server running...');
