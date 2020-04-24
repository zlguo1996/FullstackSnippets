import * as WebSocket from 'ws'
import * as net from 'net'
import * as http from 'http'
import {Peer} from './Peer'
import {Rooms} from './Rooms'
import {getIfExists} from './utils'
import * as messages from 'common-webrtc'

export class ICEServer {
    private websocketServer: WebSocket.Server
    private tcpServer: net.Server

    private rooms: Rooms = new Rooms()
    private peers: {
        [key: string]: Peer
    } = {}

    constructor(websocketPort: number, tcpPort: number) {
        this.websocketServer = new WebSocket.Server({
            port: websocketPort,
        })

        this.tcpServer = new net.Server(this.tcpConnectionListener.bind(this))
        this.tcpServer.listen(tcpPort)
        this.tcpServer.on('listening', () => console.info(`TCP signaling server is listening on port ${tcpPort}`))

        this.websocketServer.on('connection', this.websocketConnectionListener.bind(this))
        this.websocketServer.on('listening', () => console.info(`Websocket signaling server is listening on port ${websocketPort}`))
    }

    private tcpConnectionListener(socket: net.Socket) {
        const peer = new Peer(socket, getIfExists(socket.remoteAddress, ""))
        socket.on('data', (data) => this.onMessage(peer, data.toString('ascii')))
        socket.on('close', () => this.unregisterPeer(peer))
    }

    private websocketConnectionListener(socket: WebSocket, request: http.IncomingMessage) {
        const peer = new Peer(socket, this.getIp(request))
        socket.on('message', (data) => this.onMessage(peer, data as string))
        socket.on('close', () => this.unregisterPeer(peer))
    }

    private getIp(request: http.IncomingMessage): string {
        let ip = ""
        if (request.headers['x-forwarded-for']) {
            ip = (request.headers['x-forwarded-for'] as string).split(/\s*,\s*/)[0]
        } else {
            ip = getIfExists(request.connection.remoteAddress, "")
        }

        // IPv4 and IPv6 use different values to refer to localhost
        if (ip == '::1' || ip == '::ffff:127.0.0.1') {
            ip = '127.0.0.1';
        }

        return ip
    }

    private onMessage(peer: Peer, message: string) {
        const data = JSON.parse(message) as messages.Client
        console.log("new message: ", message)
        switch (data.type) {
            case 'peer-connection': {
                const d = data as messages.PeerConnection
                peer.setPeerInfo(d.peerType, d.name, d.localIp)
                this.registerPeer(peer)
                break
            }
            default: {
                console.error(`Unknown client message type: ${data.type}`)
                break
            }
        }
    }

    private registerPeer(peer: Peer) {
        this.rooms.join(peer)
        this.peers[peer.id] = peer
    }

    private unregisterPeer(peer: Peer) {
        this.rooms.leave(peer)
        delete this.peers[peer.id]
    }
}
