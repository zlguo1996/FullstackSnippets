import * as WebSocket from 'ws'
import * as http from 'http'
import uuid from 'uuid'
import {getIfExists, getCookieValue} from './utils'
import {PeerType, Server as ServerMessage, Client as ClientMessage, RoomChangeType, RoomChangeEvent} from 'common-webrtc'

export class Peer {
    socket: WebSocket
    id: string
    remoteIp: string

    name: string = ""
    localIp: string = ""
    type: PeerType = 'browser' // TODO

    registered: boolean = false

    constructor(socket: WebSocket, request: http.IncomingMessage) {
        this.socket = socket

        this.remoteIp = this.getIp(request)
        this.id = this.getId(request)
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

    private getId(request: http.IncomingMessage): string {
        return uuid()
        // const idCandidate = getCookieValue("peerId", getIfExists(request.headers.cookie, ""))
        // return idCandidate === "" ? uuid() : idCandidate
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

        this.socket.send(JSON.stringify(message))
    }
}
