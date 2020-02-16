import * as React from "react";
import * as messages from "common-webrtc"

interface Peer {
    id: string
    name: string
    localIp: string
}

export interface PeersProps {
    signalingServerAddress: string;
}

interface PeersState {
    roomMates: Peer[]
}

export class Peers extends React.Component<PeersProps, PeersState> {
    websocket: WebSocket
    constructor(props: PeersProps) {
        super(props)
        this.websocket = new WebSocket(this.props.signalingServerAddress)
        this.websocket.onopen = this.sendClientInformation.bind(this)
        this.websocket.onmessage = this.onMessage.bind(this)
        this.websocket.onclose = this.onClose.bind(this)

        this.state = {
            roomMates: []
        }
    }

    private onMessage(event: MessageEvent) {
        const data = JSON.parse(event.data) as messages.Server
        console.log('data received: ', data)

        switch (data.type) {
            case 'peers-joined': {
                const d = data as messages.RoomChangeEvent
                this.setState({
                    roomMates: [...this.state.roomMates].concat(d.peerIds.map<Peer>((val, index) => ({
                        id: val,
                        name: d.peerNames[index],
                        localIp: d.peerLocalIps[index]
                    })))
                })
                break
            }
            case 'peers-left': {
                const d = data as messages.RoomChangeEvent
                this.setState({
                    roomMates: [...this.state.roomMates].filter(roomMate => !d.peerIds.some(id => roomMate.id === id))
                })
                break
            }
            default:
                console.error(`Unknown message type: ${data.type}`)
                break
        }
    }

    private onClose(event: CloseEvent) {
        console.info('Connection is closed')
    }

    private sendClientInformation() {
        const message: messages.PeerConnection = {
            type: 'peer-connection',
            peerType: 'browser',
            name: 'browser',
            localIp: '127.0.0.1'
        }
        this.websocket.send(JSON.stringify(message))
    }

    componentWillUnmount() {
        this.websocket.close()
    }

    render() {
        return <>
            {this.state.roomMates.map(peer => <h1>{peer.id}</h1>)}
        </>
    }
}
