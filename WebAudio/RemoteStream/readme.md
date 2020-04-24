# Remote stream

Process WebRTC remote stream with Web Audio API is a bit different from local stream.
Because in chorme, simply attach remote stream to audio context would [NOT work](https://bugs.chromium.org/p/chromium/issues/detail?id=687574#c25).
[This code](https://jsfiddle.net/jmcker/4naq5ozc) shows a workaround for chrome to use web audio api to process remote stream.
