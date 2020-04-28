import {AudioNode} from '../utils/AudioNode.js'
import {TestPeers} from '../utils/TestPeers.js'
import {isChrome} from '../utils/utils.js'

window.AudioContext = window.AudioContext || window.webkitAudioContext
const context = new AudioContext()
const audioSource = new AudioNode()
const pannerNode = context.createPanner()
pannerNode.setOrientation(1, 0, 0)

function onGotRemoteStream(e) {
    let pc2Node = context.createMediaStreamSource(e.streams[0])
    pc2Node.connect(pannerNode)

    if (isChrome) {
        let a = new Audio()
        a.muted = true
        a.srcObject = e.streams[0]
    }
}
const testPeers = new TestPeers(audioSource.getStreamDestinationNode(context), onGotRemoteStream)

window.onload = () => {
    context.resume()
    testPeers.connect()
    audioSource.startPlay()
}

function bindMouseEvents(addPosition, removePosition, updatePosition) {
    const element = document.querySelector('#canvas')
    const speaker = document.createElement('div')
    speaker.setAttribute('id', 'speaker')
    element.addEventListener('mouseenter', () => {
        element.appendChild(speaker)
        addPosition()
    })
    element.addEventListener('mouseleave', () => {
        element.removeChild(speaker)
        removePosition()
    })
    element.addEventListener('mousemove', (event) => {
        const position = [
            event.clientX - element.offsetLeft,
            event.clientY - element.offsetTop
        ]
        speaker.style.left = `${position[0] - 25}px`
        speaker.style.top = `${position[1] - 25}px`
        updatePosition([position[0] - 250, position[1] - 250])
    })
}

bindMouseEvents(
    () => pannerNode.connect(context.destination),
    () => pannerNode.disconnect(),
    (position) => {
        pannerNode.setPosition(...position, 0)
    })
