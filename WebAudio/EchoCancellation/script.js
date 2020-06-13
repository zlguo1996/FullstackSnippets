let modes = ['audioTag', 'audioContext']
let modesCallbacks = [setAudioTagMode, setAudioContextMode]

// The vital difference
function gotRemoteStream(e) {
    log('Remote stream received.');

    remoteAudioStream = e.streams[0]
    audioTag = new Audio();
    audioTag.srcObject = remoteAudioStream;
    document.querySelector('#root').appendChild(audioTag)

    pc2Node = context.createMediaStreamSource(e.streams[0]);
    pc2Node.connect(context.destination);

    setAudioTagMode();
    document.querySelector('#outputMode').disabled = false;

    log('Remote stream connected.');
}

document.querySelector('#outputMode').onchange = onSelectChange
function onSelectChange() {
    const selectObj = document.querySelector('#outputMode')
    const modeIndex = modes.findIndex((val) => val === selectObj.value)
    modesCallbacks[modeIndex]()

    log(`switch to mode ${selectObj.value}`)
}

function setAudioTagMode() {
    pc2Node.disconnect();

    audioTag.muted = false;
    audioTag.play();
}

function setAudioContextMode() {
    pc2Node.connect(context.destination);

    audioTag.muted = true;
    audioTag.pause();
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let status = document.getElementById('status');
let context = new AudioContext();

const pc1 = new RTCPeerConnection(null);
const pc2 = new RTCPeerConnection(null);

let localAudioStream;
let remoteAudioStream;
let pc2Node;
let audioTag;

let offerOptions = {
    offerToReceiveAudio: 1
};

pc1.addEventListener('icecandidate', handleIceCandidates);
pc2.addEventListener('icecandidate', handleIceCandidates);
pc2.addEventListener('track', gotRemoteStream);

function start() {
    context.resume();
    connect();
}
document.getElementById('startButton').addEventListener('click', start);

async function connect() {
    await bindMicrophone()

    log('Local track added.');
    await pc1.addTrack(localAudioStream.getAudioTracks()[0], localAudioStream);

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
}

async function bindMicrophone() {
    console.log('Requesting local stream');
    const stream = await navigator.mediaDevices
        .getUserMedia({
            audio: true,
            video: false
        })

    localAudioStream = stream
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
