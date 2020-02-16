import * as WebSocket from 'ws'
import * as http from 'http'
import {Peer} from './Peer'
import {Rooms} from './Rooms'
import * as messages from 'common-webrtc'

export class ICEServer {
    private websocketServer: WebSocket.Server

    private rooms: Rooms = new Rooms()
    private peers: {
        [key: string]: Peer
    } = {}

    constructor(port: number) {
        this.websocketServer = new WebSocket.Server({
            port: port,
        })

        this.websocketServer.on('connection', this.onWsConnection.bind(this))
        this.websocketServer.on('listening', () => console.info(`Websocket ICE server is listening on port ${port}`))
    }

    private onWsConnection(socket: WebSocket, request: http.IncomingMessage) {
        const peer = new Peer(socket, request)
        socket.on('message', (data) => this.onMessage(peer, data))
        socket.on('close', () => this.unregisterPeer(peer))
    }

    private onMessage(peer: Peer, message: WebSocket.Data) {
        const data = JSON.parse(message as string) as messages.Client
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
