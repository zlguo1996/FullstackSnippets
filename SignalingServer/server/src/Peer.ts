import * as WebSocket from 'ws'
import {Socket} from 'net'
import * as http from 'http'
import uuid from 'uuid'
import {getIfExists, getCookieValue} from './utils'
import {PeerType, Server as ServerMessage, Client as ClientMessage, RoomChangeType, RoomChangeEvent} from 'common-webrtc'
import isIp from 'is-ip'

export class Peer {
    socket: WebSocket | Socket
    id: string
    remoteIp: string

    name: string = ""
    localIp: string = ""
    type: PeerType = 'browser'

    registered: boolean = false

    constructor(socket: WebSocket | Socket, remoteIp: string) {
        if (!isIp(remoteIp)) {
            console.error(`'${remoteIp}' is not a valid ip address.`)
        }

        this.socket = socket

        this.remoteIp = remoteIp
        this.id = uuid()

    }

    setPeerInfo(type: PeerType, name: string | undefined, localIp: string | undefined) {
        this.type = type
        this.name = name || ""
        this.localIp = localIp || ""
    }

    get roomId(): string {
        return this.remoteIp
    }

    onPeersJoined(peers: Peer[]) {
        this.sendRoomChangeEvent('peers-joined', peers)
    }
    onPeersLeft(peers: Peer[]) {
        this.sendRoomChangeEvent('peers-left', peers)
    }

    private sendRoomChangeEvent(type: RoomChangeType, peers: Peer[]) {
        const message: RoomChangeEvent = {
            type: type,
            peerIds: peers.map(peer => peer.id),
            peerNames: peers.map(peer => peer.name),
            peerLocalIps: peers.map(peer => peer.localIp),
        }
        this.send(message)
    }

    private send(message: ServerMessage) {
        if (this.type !== 'browser') return     // not send message to nuibot

        if ('send' in this.socket) {
            this.socket.send(JSON.stringify(message))
        } else {
            this.socket.write(JSON.stringify(message), 'ascii')
        }
    }
}
