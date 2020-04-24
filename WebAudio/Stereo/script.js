import {AudioNode} from '../utils/AudioNode.js';
import {TestPeers} from '../utils/TestPeers.js'

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext()
const audioSource = new AudioNode()

function onGotRemoteStream(e) {
    let pc2Node = context.createMediaStreamSource(e.streams[0]);
    pc2Node.connect(context.destination);

    let a = new Audio();
    a.muted = true;
    a.srcObject = e.streams[0];
}
const testPeers = new TestPeers(audioSource.getStreamDestinationNode(context), onGotRemoteStream)

document.body.querySelector('#startButton').addEventListener('click', () => {
    context.resume()
    testPeers.connect()
    audioSource.startPlay()
})
