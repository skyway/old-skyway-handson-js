const Peer = window.Peer;

(async function main() {
    const localVideo = document.getElementById('js-local-video');
    const localId = document.getElementById('js-local-id');
    const remoteVideo = document.getElementById('js-remote-video');
    const remoteId = document.getElementById('js-remote-id');
    const connectedId = document.getElementById('js-connected-id');
    const callTrigger = document.getElementById('js-call-trigger');
    const closeTrigger = document.getElementById('js-close-trigger');

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

    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        connectedId.textContent = mediaConnection.remoteId;

        mediaConnection.on('stream', stream => {
            remoteVideo.srcObject = stream;
        });

        mediaConnection.once('close', () => {
            remoteVideo.srcObject.getTracks().forEach(track => {
                track.stop();
            });
            remoteVideo.srcObject = null;
            connectedId.textContent = '...';
        });

        closeTrigger.addEventListener('click', () => {
            mediaConnection.close(true);
        });
    });

    callTrigger.addEventListener('click', () => {
        const mediaConnection = peer.call(remoteId.value, localStream);
        connectedId.textContent = mediaConnection.remoteId;

        mediaConnection.on('stream', stream => {
            remoteVideo.srcObject = stream;
        });

        mediaConnection.once('close', () => {
            remoteVideo.srcObject.getTracks().forEach(track => {
                track.stop();
            });
            remoteVideo.srcObject = null;
            connectedId.textContent = '...';
        });

        closeTrigger.addEventListener('click', () => {
            mediaConnection.close(true);
        });
    });

    peer.on('error', console.error);
})();