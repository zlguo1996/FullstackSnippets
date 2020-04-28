# Web Audio

Test projects for testing web audio API. This project is inspired by [audio effects for web game](https://www.html5rocks.com/en/tutorials/webaudio/games/).
I want to create 3D sound effect for online meeting using WebRTC. This project is used to test Web Audio APIs.



## Commands

1. Install modules:

```
yarn install
```

2. Start server:

```
npx http-server .
```



## Directory

1. [Audio tag](./AudioTag): Use audio tag as source for web audio API.

2. [Local stream](./LocalStream): Connect local stream (mic) to web audio API.

   Note that connect stream to audio tag, and then connect it to audio context will **not** work.

3. [Remote stream](./RemoteStream): Connect remote WebRTC stream to web audio API.

   Note that on chrome, need connect stream to audio tag.

4. [Stereo](./Stereo): 3D audio effect
