export class AudioNode {
    constructor(path = '../docs/nyan.wav') {
        this.audio = new Audio()
        this.audio.src = '../docs/nyan.wav';
        this.audio.controls = true;
        this.audio.autoplay = true;
        this.audio.loop = true;
        document.body.appendChild(this.audio);
    }
    getStreamDestinationNode(context) {
        let src = context.createMediaElementSource(this.audio)

        let dest = context.createMediaStreamDestination()
        src.connect(dest)

        return dest
    }
    startPlay() {
        this.audio.play()
    }
}
