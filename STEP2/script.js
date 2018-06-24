$(function(){

    let localStream = null;
    let peer = null;
    let existingCall = null;

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(function (stream) {
            $('#myStream').get(0).srcObject = stream;
            localStream = stream;
        }).catch(function (error) {
            console.error('mediaDevice.getUserMedia() error:', error);
            return;
        });

    peer = new Peer({
        key: 'APIKEY',
        debug: 3
    });

    peer.on('open', function(){
        $('#my-id').text(peer.id);
    });

    peer.on('call', function(call){
        call.answer(localStream);
        setupCallEventHandlers(call);
    });

    peer.on('error', function(err){
        alert(err.message);
    });

    $('#make-call').submit(function(e){
        e.preventDefault();
        const call = peer.call($('#peer-id').val(), localStream);
        setupCallEventHandlers(call);
    });

    $('#end-call').click(function(){
        existingCall.close();
    });

    function setupCallEventHandlers(call){
        if (existingCall) {
            existingCall.close();
        };

        existingCall = call;

        call.on('stream', function(stream){
            addVideo(call,stream);
            setupEndCallUI();
            $('#connected-peer-id').text(call.remoteId);
        });

        call.on('close', function(){
            removeVideo(call.remoteId);
            setupMakeCallUI();
        });
    }

    function addVideo(call,stream){
        const videoDom = $('<video autoplay>');
        videoDom.attr('id',call.remoteId);
        videoDom.get(0).srcObject = stream;
        $('.videosContainer').append(videoDom);
    }

    function removeVideo(peerId){
        $('#'+peerId).remove();
    }

    function setupMakeCallUI(){
        $('#make-call').show();
        $('#end-call').hide();
    }
    
    function setupEndCallUI() {
        $('#make-call').hide();
        $('#end-call').show();
    }

});