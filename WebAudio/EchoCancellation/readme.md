# Echo Cancellation

In our [jitsi-party](https://github.com/zlguo1996/jitsi-party) project, we find that echo cancellation is not working. This project aims to find the range where [echoCancellation setting](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/echoCancellation) of media track is working.

## Related Works

- [WebRTC samples - Peer connection - audio only](https://webrtc.github.io/samples/src/content/peerconnection/audio/) create 2 peers (pc1, pc2) on one tab. pc1 streams local audio to pc2. And pc2 would play the audio on audio tag. Since the echo cancellation is on by default, we can hear that there's no echo. 

- [This issue](https://github.com/webrtc/samples/issues/1243) describes that in [WebRTC samples - MediaRecorder](https://webrtc.github.io/samples/src/content/getusermedia/record/), the local audio output is not processed by echo cancellation. If one first record with talking, then play. Then record again with out talking. In the second play, one can still hear the sound of replay from the first record.
- [This reply](https://github.com/webrtc/samples/issues/1243#issuecomment-626810415) says that in Chrome, only received audio from RTCPeerConnection audio track is cancelled.

## Tests

In our project, we use the remote audio track of RTCPeerConnection. But the echo is not cancelled. The reason might be that the remote audio is processed by web audio API.

In the example, we allow user to switch output from normal audio tag or audio context. We find that **only output by audio tag would perform echo cancellation**. When use audio context to output audio, echo would happen.