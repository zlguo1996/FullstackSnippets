import {AudioNode} from '../utils/AudioNode.js'

// The vital difference
function gotRemoteStream(e) {
    log('Remote stream received.');

    // This should be all that is required to receive audio
    pc2Node = context.createMediaStreamSource(e.streams[0]);
    pc2Node.connect(context.destination);

    log('Remote stream connected.');

    setTimeout(() => {
        log('Connecting stream to audio element...');

        let a = new Audio();
        a.muted = true;
        a.srcObject = e.streams[0];

        log('Stream connected to audio element.');
    }, 3000);

}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let status = document.getElementById('status');
let context = new AudioContext();

const pc1 = new RTCPeerConnection(null);
const pc2 = new RTCPeerConnection(null);
const audioNode = new AudioNode()
let pc1Node = audioNode.getStreamDestinationNode(context);
let pc2Node;

let offerOptions = {
    offerToReceiveAudio: 1
};

pc1.addEventListener('icecandidate', handleIceCandidates);
pc2.addEventListener('icecandidate', handleIceCandidates);
pc2.addEventListener('track', gotRemoteStream);

async function connect() {
    log('Local track added.');
    await pc1.addTrack(pc1Node.stream.getAudioTracks()[0], pc1Node.stream);

    log('Sending offer...');
    let offer = await pc1.createOffer(offerOptions);
    await pc1.setLocalDescription(offer);
    await pc2.setRemoteDescription(offer);
    log('Offer sent.');

    log('Sending answer...');
    let answer = await pc2.createAnswer(offerOptions);
    await pc1.setRemoteDescription(answer);
    await pc2.setLocalDescription(answer);
    log('Answer sent.');

    log('\nWaiting 3 seconds to connect stream to audio element...');
}

async function handleIceCandidates(e) {
    if (e.candidate) {
        await getOtherPeer(e.target).addIceCandidate(new RTCIceCandidate(e.candidate));
    }
}

function getOtherPeer(peer) {
    return (peer === pc1) ? pc2 : pc1;
}

function log(msg) {
    console.log(msg);
    status.innerHTML += `${msg}\n`;
}

function start() {
    context.resume();
    connect();
    audioNode.startPlay();
}

document.getElementById('startButton').addEventListener('click', start);
