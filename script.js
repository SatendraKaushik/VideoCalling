const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;
const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };

// Start Call
startCallButton.addEventListener('click', async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        
        peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
        
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                // Send the candidate to the remote peer through the signaling server
            }
        };
        
        peerConnection.ontrack = event => {
            remoteVideo.srcObject = event.streams[0];
        };

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // Send the offer to the remote peer through the signaling server
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
});

// End Call
endCallButton.addEventListener('click', () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
    }
});