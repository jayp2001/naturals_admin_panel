import React, { useEffect, useRef, useState } from 'react';
import { BACKEND_BASE_URL, SOCKET_URL } from '../../url';
import axios from 'axios';
import io from 'socket.io-client';
import Video from './with_you.mp4';
import FullScreenVideo from './videoPlayer';
import './video.css'
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import bhagwatiHeaderLogo from '../../assets/NATURAL_LOGO.jpg';
import bhagwatiLogo from '../../assets/bhagwatiLogo.png';
import { useNavigate } from "react-router-dom";

const TokenView = () => {
    const boxStyle = {
        height: '155px',
        width: '155px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '30px',
        backgroundColor: 'red'
    };
    const [voiceTest, setVoiceTest] = useState()
    const [tokenList, setTokenList] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const videoRef = useRef(null);
    const navigate = useNavigate();

    const logout = () => {
        if (window.confirm("Are you sure !,you want to logout")) {
            localStorage.removeItem('userInfo');
            navigate(`/login`)
        }
    }

    // const voices = speechSynthesis.getVoices();
    // if (voices.length) {
    //     setVoiceTest(voices.find(voice => voice.name.includes("Google हिन्दी")) || voices[0])
    // }
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("speakToken", (message) => {
            console.log('message', message)
            getTokenNumberList();
            if (message) {
                speakToken(message)
            }
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    // useEffect(() => {
    //     const loadVoice = () => {
    //         const voices = window.speechSynthesis.getVoices();
    //         const selectedVoice = voices.find(voice => voice.name.includes("Google हिन्दी")) || voices[0]

    //         if (selectedVoice) {
    //             setVoiceTest(selectedVoice); // Set voice only once
    //         }
    //     };
    //     loadVoice();
    //     window.speechSynthesis.onvoiceschanged = loadVoice; // Ensure voices are loaded
    // }, []);
    useEffect(() => {
        getTokenNumberList();
        // const keepAliveInterval = setInterval(() => {
        //     const silence = new SpeechSynthesisUtterance("");
        //     window.speechSynthesis.speak(silence);
        //     console.log('speak')
        // }, 2000);
        // return () => clearInterval(keepAliveInterval);
    }, []);

    const getTokenNumberList = async () => {
        try {
            const res = await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDisplayTokenNumbr`, config);
            console.log('Response Data', res);
            setTokenList(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = (tokenNumber) => {
        speakToken(tokenNumber);
    };

    function speakToken(tokenNumber) {

        // const setVoiceAndSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(`Token Number ${tokenNumber}`);
        // const voices = speechSynthesis.getVoices();
        // if (voices.length) {
        // const femaleVoice = voices.find(voice => voice.name.includes("Google हिन्दी")) || voices[0];
        // utterance.voice = voiceTest;
        window.speechSynthesis.speak(utterance);
        // window.speechSynthesis.cancel();
        console.log("Voice selected and speaking");
        // } else {
        //     console.log("No voices available");
        // }
        // };
        // if (speechSynthesis.getVoices().length) {
        //     // Voices already loaded
        //     setVoiceAndSpeak();
        // } else {
        //     // Retry with voiceschanged event
        //     speechSynthesis.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });

        //     // Fallback in case voiceschanged event doesn't fire
        //     setTimeout(() => {
        //         if (!utterance.voice) {
        //             console.log("Retrying to fetch voices after delay");
        //             setVoiceAndSpeak();
        //         }
        //     }, 500);
        // }
    }


    // function selectFemaleVoice() {
    //     const voices = speechSynthesis.getVoices();
    //     const femaleVoices = voices.filter(voice => voice.name.includes("Google हिन्दी") || voice.name.includes("Google हिन्दी"));
    //     return femaleVoices.length ? femaleVoices[0] : voices[0];
    // }
    // const speakToken = (tokenNumber) => {
    //     window.speechSynthesis.cancel();
    //     const utterance = new SpeechSynthesisUtterance(`Token Number ${tokenNumber}`);
    //     utterance.voice = selectFemaleVoice();
    //     window.speechSynthesis.speak(utterance);
    // };

    const HeaderContainer = () => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '110px', // 50px hover area + 60px header
                    zIndex: 1002
                }}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '60px',
                        background: '#fff',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px',
                        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={bhagwatiHeaderLogo} alt='No Image Found' style={{ width: '200px', height: 'fit-content' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div
                            onClick={() => navigate('/dashboard')}
                            style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: 'rgb(52, 71, 103)',
                                cursor: 'pointer',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s',
                                ':hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                }
                            }}
                        >
                            Back to Dashboard
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s',
                                ':hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                }
                            }}
                        >
                            <LogoutIcon fontSize='medium' />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const responce = () => {
        if (tokenList.length) {
            return (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'white',
                    zIndex: 1,
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        opacity: 0.3,
                        zIndex: 0,
                        backgroundImage: `url(${bhagwatiLogo})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none'
                    }} />
                    <HeaderContainer />
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        padding: '40px',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        {tokenList.map((val, index) => (
                            <div key={index} style={{ width: 'fit-content', display: 'flex' }}>
                                <div style={boxStyle} onClick={() => handleClick(val.tokenNo)}>
                                    <p style={{ fontSize: '78px', fontWeight: 'bold', color: 'white' }}>{val.tokenNo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'black',
                    zIndex: 1
                }}>
                    <HeaderContainer />
                    <video
                        ref={videoRef}
                        src={Video}
                        autoPlay
                        loop
                        muted
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            )
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
        }}>
            {responce()}
        </div>
    );
}

export default TokenView;
