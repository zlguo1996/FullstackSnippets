# Interactive Connectivity Establishment

### Objective

In [Nuibot project](http://nuibot.haselab.net/), we want to automatically detect Nuibot devices in LAN in web application. This is a test project using an intermediate ICE server to solve this problem.

### Commands

#### Development

1. Link common package to the global folder

   ```
   cd ./common
   yarn install
   yarn lint
   ```

2. Run WebRTC ICE server:

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