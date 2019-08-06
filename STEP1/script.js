(async function main() {
    const localVideo = document.getElementById('js-local-video');

    const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });

    localVideo.srcObject = localStream;
})();
