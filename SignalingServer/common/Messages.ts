export type RoomChangeType = 'peers-joined' | 'peers-left'
type PeerConnectionType = 'peer-connection'
export type PeerType = 'browser' | 'nuibot'

// base interface for message from server
export interface Server {
    type: RoomChangeType
}

// base interface for message from client
export interface Client {
    type: PeerConnectionType
}

export interface RoomChangeEvent extends Server {
    type: RoomChangeType
    peerIds: string[]
    peerNames: string[]
    peerLocalIps: string[]
}

export interface PeerConnection extends Client {
    type: PeerConnectionType
    peerType: PeerType
    name?: string
    localIp?: string
}
