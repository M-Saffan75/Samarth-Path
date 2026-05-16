// components/VideoPlayer.js
import Video from 'react-native-video'
import { COLOURS } from '../assets/theme/Theme'
import Slider from '@react-native-community/slider'
import React, { useRef, useState, useEffect } from 'react'
import Orientation from 'react-native-orientation-locker'
import { globalImages } from '../assets/images/images_file/All_Images';
import { View, TouchableOpacity, StyleSheet, Text, Image, Modal, StatusBar } from 'react-native'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
}

const VideoPlayer = ({ uri, videoId, activeVideoId, setActiveVideoId, style, fullshow }) => {

    const videoRef = useRef(null)
    const fullscreenVideoRef = useRef(null)
    const paused = activeVideoId !== videoId

    const [muted, setMuted] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [seeking, setSeeking] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const hideTimeout = useRef(null)

    const resetHideTimer = () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current)
        setShowControls(true)
        hideTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }

    useEffect(() => {
        if (!paused) {
            resetHideTimer()
        } else {
            if (hideTimeout.current) clearTimeout(hideTimeout.current)
            setShowControls(true)
        }
        return () => { if (hideTimeout.current) clearTimeout(hideTimeout.current) }
    }, [paused])

    useEffect(() => {
        return () => {
            if (hideTimeout.current) clearTimeout(hideTimeout.current)
            // fullscreen se bahar niklo agar screen unmount ho
            if (isFullscreen) exitFullscreen()
        }
    }, [])

    const togglePlay = () => {
        setActiveVideoId(paused ? videoId : null)
        resetHideTimer()
    }

    const toggleMute = () => {
        setMuted(prev => !prev)
        resetHideTimer()
    }

    const onLoad = (data) => setDuration(data.duration)

    const onProgress = (data) => {
        if (!seeking) setCurrentTime(data.currentTime)
    }

    const onEnd = () => {
        setActiveVideoId(null)
        setCurrentTime(0)
        videoRef.current?.seek(0)
        fullscreenVideoRef.current?.seek(0)
    }

    const onSliderChange = (value) => {
        setSeeking(true)
        setCurrentTime(value)
        resetHideTimer()
    }

    const onSliderComplete = (value) => {
        videoRef.current?.seek(value)
        fullscreenVideoRef.current?.seek(value)
        setSeeking(false)
        resetHideTimer()
    }

    const openFullscreen = () => {
        setIsFullscreen(true)
        Orientation.lockToLandscape()
        resetHideTimer()
        // video play karo fullscreen mein bhi
        if (paused) setActiveVideoId(videoId)
    }

    const exitFullscreen = () => {
        setIsFullscreen(false)
        Orientation.lockToPortrait()
        // sync position
        if (fullscreenVideoRef.current) {
            fullscreenVideoRef.current?.seek(currentTime)
        }
    }

    // ---- Shared Controls UI ----
    const renderControls = (isFS) => (
        <View style={[styles.controls, isFS && styles.controls_fs]} pointerEvents="box-none">

            {/* Top row: mute + minimize/maximize */}
            <View style={[styles.top_row, { marginTop: isFS ? responsiveWidth(1) : responsiveWidth(1) }]}>
                <TouchableOpacity onPress={toggleMute} style={[styles.icon_btn, { backgroundColor: isFS ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }]}>
                    <Image
                        source={muted ? globalImages.mute : globalImages.volume}
                        style={styles.icon_img}
                        tintColor={COLOURS.white}
                    />
                </TouchableOpacity>

                {fullshow ? <TouchableOpacity
                    onPress={isFS ? exitFullscreen : openFullscreen}
                    style={[styles.full_btn, { backgroundColor: isFS ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }]}
                >
                    <Image
                        source={isFS ? globalImages.minimize_icon : globalImages.maximize_icon}
                        style={styles.icon_img}
                        tintColor={COLOURS.white}
                    />
                </TouchableOpacity> : ''}

            </View>

            {/* Center: play/pause */}
            <TouchableOpacity onPress={togglePlay} activeOpacity={0.8}
                style={[styles.center_btn, { backgroundColor: isFS ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }]}>
                <Image
                    source={paused ? globalImages.play : globalImages.pause}
                    style={styles.icon_pause}
                    tintColor={COLOURS.white}
                />
            </TouchableOpacity>

            {/* Bottom: time + slider */}
            <View style={styles.bottom_row}>
                <Text style={styles.time}>{formatTime(currentTime)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration || 1}
                    value={currentTime}
                    onValueChange={onSliderChange}
                    onSlidingComplete={onSliderComplete}
                    minimumTrackTintColor={COLOURS.primary}
                    maximumTrackTintColor={COLOURS.light_grey}
                    thumbTintColor={COLOURS.primary}
                />
                <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>

        </View>
    )

    return (
        <>
            {/* ---- Normal (inline) player ---- */}
            <View style={[styles.wrapper, style]}>
                <Video
                    ref={videoRef}
                    source={{ uri }}
                    style={styles.video}
                    paused={isFullscreen ? true : paused} // fullscreen open ho tw inline ruk jaye
                    muted={muted}
                    resizeMode="cover"
                    onLoad={onLoad}
                    onProgress={onProgress}
                    onEnd={onEnd}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch="obey"
                    maxBitRate={2000000}
                    progressUpdateInterval={500}
                    reportBandwidth={false}
                />

                {/* Tap to show/hide controls */}
                <TouchableOpacity
                    style={StyleSheet.absoluteFillObject}
                    activeOpacity={1}
                    onPress={() => {
                        if (showControls) {
                            setShowControls(false)
                            if (hideTimeout.current) clearTimeout(hideTimeout.current)
                        } else {
                            resetHideTimer()
                        }
                    }}
                />

                {showControls && renderControls(false)}
            </View>

            {/* ---- Fullscreen Modal ---- */}
            <Modal
                visible={isFullscreen}
                animationType="fade"
                supportedOrientations={['landscape']}
                onRequestClose={exitFullscreen}
                statusBarTranslucent
            >
                <StatusBar hidden />
                <View style={styles.fs_container}>
                    <Video
                        ref={fullscreenVideoRef}
                        source={{ uri }}
                        style={StyleSheet.absoluteFillObject}
                        paused={paused}
                        muted={muted}
                        resizeMode="contain"
                        onLoad={(data) => {
                            setDuration(data.duration)
                            // inline ki current position se shuru karo
                            fullscreenVideoRef.current?.seek(currentTime)
                        }}
                        onProgress={onProgress}
                        onEnd={onEnd}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch="obey"
                        maxBitRate={2000000}
                        progressUpdateInterval={500}
                        reportBandwidth={false}
                    />

                    {/* Tap to toggle controls in fullscreen */}
                    <TouchableOpacity
                        style={StyleSheet.absoluteFillObject}
                        activeOpacity={1}
                        onPress={() => {
                            if (showControls) {
                                setShowControls(false)
                                if (hideTimeout.current) clearTimeout(hideTimeout.current)
                            } else {
                                resetHideTimer()
                            }
                        }}
                    />

                    {showControls && renderControls(true)}
                </View>
            </Modal>
        </>
    )
}

export default VideoPlayer

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        borderRadius: responsiveWidth(3),
        overflow: 'hidden',
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    fs_container: {
        flex: 1,
        backgroundColor: '#000',
    },
    controls: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: responsiveWidth(3),
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    controls_fs: {
        padding: responsiveWidth(2),
    },
    top_row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // mute left, maximize/minimize right
        alignItems: 'center',
        marginHorizontal: responsiveWidth(2),
    },

    icon_btn: {
        padding: responsiveWidth(2),
        borderRadius: responsiveWidth(100)
    },

    full_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: responsiveWidth(1),
        borderRadius: responsiveWidth(100),
    },

    center_btn: {
        alignSelf: 'center',
        padding: responsiveWidth(3),
        borderRadius: responsiveWidth(100),
    },

    bottom_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(2),
    },
    slider: {
        flex: 1,
        height: responsiveWidth(5),
    },
    time: {
        color: COLOURS.white,
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.4),
        minWidth: responsiveWidth(8),
        textAlign: 'center',
    },
    icon_pause: {
        height: responsiveWidth(7),
        width: responsiveWidth(7),
    },
    icon_img: {
        height: responsiveWidth(4),
        width: responsiveWidth(4),
    },
})