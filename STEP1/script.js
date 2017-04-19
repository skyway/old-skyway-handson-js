$(function(){

    let localStream = null;

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(function (stream) {
            $('#myStream').get(0).srcObject = stream;
            localStream = stream;
        }).catch(function (error) {
            console.error('mediaDevice.getUserMedia() error:', error);
            return;
        });

});