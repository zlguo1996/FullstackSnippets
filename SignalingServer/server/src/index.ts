import {ICEServer} from './ICEServer'

// const server = new ICEServer(8001, 8002)

import http from 'http'

const server = new http.Server(requestListener)

function requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            console.log(body);
            res.end('ok');
        });
        req.on('close', () => {
            console.log('close')
        })
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
}

server.listen(8002, '0.0.0.0', undefined, () => {
    console.log(`Http server is running on port 8002`)
})
