const Peer = window.Peer;

(async function main() {
    const localVideo = document.getElementById('js-local-video');
    const localId = document.getElementById('js-local-id');
    const videosContainer = document.getElementById('js-videos-container');
    const roomId = document.getElementById('js-room-id');
    const messages = document.getElementById('js-messages');
    const joinTrigger = document.getElementById('js-join-trigger');
    const leaveTrigger = document.getElementById('js-leave-trigger');

    const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    localVideo.srcObject = localStream;

    const peer = new Peer({
        key: window.__SKYWAY_KEY__,
        debug: 3,
    });

    peer.on('open', (id) => {
        localId.textContent = id;
    });

    joinTrigger.addEventListener('click', () => {
        const room = peer.joinRoom(roomId.value, {
            mode: 'sfu',
            stream: localStream,
        });

        room.on('open', () => {
            messages.textContent += `===You joined===\n`;
        });

        room.on('peerJoin', peerId => {
            messages.textContent += `===${peerId} joined===\n`;
        });

        room.on('stream', async stream => {
            const remoteVideo = document.createElement('video');
            remoteVideo.srcObject = stream;
            remoteVideo.playsInline = true;
            remoteVideo.setAttribute('data-peer-id', stream.peerId);
            videosContainer.append(remoteVideo);

            await remoteVideo.play().catch(console.error);
        });

        room.on('peerLeave', peerId => {
            const remoteVideo = videosContainer.querySelector(`[data-peer-id="${peerId}"]`);
            remoteVideo.srcObject.getTracks().forEach(track => {
                track.stop();
            });
            remoteVideo.srcObject = null;
            remoteVideo.remove();

            messages.textContent += `===${peerId} left===\n`;
        });

        room.once('close', () => {
            messages.textContent += '===You left ===\n';
            const remoteVideos = videosContainer.querySelectorAll('[data-peer-id]');
            Array.from(remoteVideos)
            .forEach(remoteVideo => {
                remoteVideo.srcObject.getTracks().forEach(track => track.stop());
                remoteVideo.srcObject = null;
                remoteVideo.remove();
              });
        });

        leaveTrigger.addEventListener('click', () => {
            room.close();
        }, { once: true });
    });

    peer.on('error', console.error);
})();
