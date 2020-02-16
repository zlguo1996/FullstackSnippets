# Signaling server

### Objective

In [Nuibot project](http://nuibot.haselab.net/), we want to automatically detect Nuibot devices in LAN in web application. This is a test project using an intermediate signaling server to solve this problem.

### Approach

- The intermediate server stores local IP and other information for every peer.
- Two peers are considered in the same LAN when they possess same remote IP.
- Every peer would be informed if other peer join / leave the same LAN.
- Browser could use local IP of Nuibot to start a direct websocket connection.

### Commands

#### Development

1. Link common package to the global folder

   ```
   cd ./common
   yarn install
   yarn lint
   ```

2. Run signaling server:

    ```
    cd ./server
    yarn install
    yarn link common-webrtc
    yarn devServer
    ```
    
3. Serve client:

    ```
    cd ./client
    yarn install
    yarn link common-webrtc
    yarn devServer
    ```

### References

[snapdrop](https://github.com/RobinLinus/snapdrop)

[Getting Started with WebRTC](https://www.html5rocks.com/en/tutorials/webrtc/basics/)

[Google I/O 2013 WebRTC slider](http://io13webrtc.appspot.com/#1)
