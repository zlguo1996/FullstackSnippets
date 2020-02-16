import {Peer} from './Peer'

class Room {
    private guests: Peer[] = []

    join(guest: Peer) {
        this.guests.push(guest)
    }

    leave(guest: Peer) {
        this.guests = this.guests.filter(({id}) => (id !== guest.id))
    }

    has(guest: Peer): boolean {
        return this.guests.some(({id}) => (id === guest.id))
    }

    isEmpty(): boolean {
        return this.guests.length === 0
    }

    *[Symbol.iterator] () {
        for (const guest of this.guests) {
            yield guest
        }
    }
}

export class Rooms {
    private rooms: {
        [key: string]: Room
    } = {}

    join(guest: Peer) {
        if (!this.rooms[guest.roomId]) {
            this.rooms[guest.roomId] = new Room()
        }
        const room = this.rooms[guest.roomId]

        for (const roomMate of room) {
            roomMate.onPeersJoined([guest])
        }
        guest.onPeersJoined([...room])

        room.join(guest)
        guest.registered = true
    }

    leave(guest: Peer) {
        if (!guest.registered) {
            return
        }

        const room = this.rooms[guest.roomId]
        room.leave(guest)
        guest.registered = false

        for (const roomMate of room) {
            roomMate.onPeersLeft([guest])
        }

        if (this.rooms[guest.roomId].isEmpty()) {
            delete this.rooms[guest.roomId]
        }
    }

    distributedRoom(guest: Peer): Room {
        return this.rooms[guest.roomId]
    }
}
