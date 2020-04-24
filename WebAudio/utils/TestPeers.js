export class TestPeers {
    constructor(sourceNode, onGotRemoteStream) {
        this.handleIceCandidates = this.handleIceCandidates.bind(this)

        this.pc1 = new RTCPeerConnection(null);
        this.pc2 = new RTCPeerConnection(null);
        this.pc1Node = sourceNode;

        this.offerOptions = {
            offerToReceiveAudio: 1
        };

        this.pc1.addEventListener('icecandidate', this.handleIceCandidates);
        this.pc2.addEventListener('icecandidate', this.handleIceCandidates);
        this.pc2.addEventListener('track', onGotRemoteStream);
    }

    async handleIceCandidates(e) {
        if (e.candidate) {
            await this.getOtherPeer(e.target).addIceCandidate(new RTCIceCandidate(e.candidate));
        }
    }

    getOtherPeer(peer) {
        return (peer === this.pc1) ? this.pc2 : this.pc1;
    }

    async connect() {
        console.log('Local track added.');
        await this.pc1.addTrack(this.pc1Node.stream.getAudioTracks()[0], this.pc1Node.stream);

        console.log('Sending offer...');
        let offer = await this.pc1.createOffer(this.offerOptions);
        await this.pc1.setLocalDescription(offer);
        await this.pc2.setRemoteDescription(offer);
        console.log('Offer sent.');

        console.log('Sending answer...');
        let answer = await this.pc2.createAnswer(this.offerOptions);
        await this.pc1.setRemoteDescription(answer);
        await this.pc2.setLocalDescription(answer);
        console.log('Answer sent.');
    }
}
