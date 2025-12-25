// FullScreenVideo.js
import React, { useEffect, useRef } from 'react';

const FullScreenVideo = ({ videoSrc, tokenList }) => {
    const videoRef = useRef(null);

    // useEffect(() => {
    //     const videoElement = videoRef.current;
    //     const enterFullScreen = async () => {
    //         if (videoElement && document.fullscreenElement !== videoElement) {
    //             try {
    //                 await videoElement.requestFullscreen();
    //             } catch (err) {
    //                 console.error('Error attempting to enable full-screen mode:', err);
    //             }
    //         }
    //     };

    //     enterFullScreen();
    // }, [tokenList]);

    return (
        <video ref={videoRef} src={videoSrc} autoPlay loop muted style={{ width: '100%', height: '100%' }} />
    );
};

export default FullScreenVideo;
