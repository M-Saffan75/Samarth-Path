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
    if (!seconds || isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
}

const VideoPlayer = ({ uri, videoId, activeVideoId, setActiveVideoId, style, fullshow }) => {

    console.log('uri,', uri ? uri : 'no video uri')
    const videoRef = useRef(null)
    const fullscreenVideoRef = useRef(null)
    const paused = activeVideoId !== videoId

    const [muted, setMuted] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [showControls, setShowControls] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // ✅ Slider ke liye alag local value — video se independent
    const [sliderValue, setSliderValue] = useState(0)
    const isSeeking = useRef(false)

    const currentTimeRef = useRef(0)
    const durationRef = useRef(0)
    const hideTimeout = useRef(null)

    const resetHideTimer = () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current)
        setShowControls(true)
        hideTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }

    useEffect(() => {
        if (!paused) resetHideTimer()
        else {
            if (hideTimeout.current) clearTimeout(hideTimeout.current)
            setShowControls(true)
        }
        return () => { if (hideTimeout.current) clearTimeout(hideTimeout.current) }
    }, [paused])

    useEffect(() => {
        return () => {
            if (hideTimeout.current) clearTimeout(hideTimeout.current)
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

    const onLoad = (data) => {
        const d = data?.duration
        if (d && isFinite(d) && !isNaN(d) && d > 0 && d < 86400) {
            setDuration(d)
            durationRef.current = d
        }
    }

    const onProgress = (data) => {
        // ✅ Sirf tab update karo jab user drag nahi kar raha
        if (!isSeeking.current) {
            setCurrentTime(data.currentTime)
            setSliderValue(data.currentTime)   // slider bhi sync
            currentTimeRef.current = data.currentTime
        }
        if (durationRef.current === 0 && data.seekableDuration > 0) {
            setDuration(data.seekableDuration)
            durationRef.current = data.seekableDuration
        }
    }

    const onFullscreenLoad = (data) => {
        const d = data?.duration
        if (d && isFinite(d) && !isNaN(d) && d > 0) {
            setDuration(d)
            durationRef.current = d
        }
        const seekTo = currentTimeRef.current
        if (seekTo > 0) {
            setTimeout(() => {
                fullscreenVideoRef.current?.seek(seekTo)
            }, 100)
        }
    }

    const onFullscreenProgress = (data) => {
        if (!isSeeking.current) {
            setCurrentTime(data.currentTime)
            setSliderValue(data.currentTime)
            currentTimeRef.current = data.currentTime
        }
        if (durationRef.current === 0 && data.seekableDuration > 0) {
            setDuration(data.seekableDuration)
            durationRef.current = data.seekableDuration
        }
    }

    const onEnd = () => {
        setActiveVideoId(null)
        setCurrentTime(0)
        setSliderValue(0)
        currentTimeRef.current = 0
        videoRef.current?.seek(0)
        fullscreenVideoRef.current?.seek(0)
    }

    // ✅ Drag shuru — video progress update band, sirf slider move karo
    const onSliderStart = () => {
        isSeeking.current = true
        resetHideTimer()
    }

    // ✅ Drag chal raha hai — sirf sliderValue update karo, currentTime nahi
    const onSliderChange = (value) => {
        setSliderValue(value)
        resetHideTimer()
    }

    // ✅ Drag khatam — ab seek karo aur progress dobara shuru
    const onSliderComplete = (value) => {
        console.log('seek to:', value, 'ref exists:', !!videoRef.current)
        setSliderValue(value)
        setCurrentTime(value)
        currentTimeRef.current = value
        videoRef.current?.seek(value)
        fullscreenVideoRef.current?.seek(value)
        // Thoda delay — seek complete hone do pehle
        setTimeout(() => {
            isSeeking.current = false
        }, 200)
        resetHideTimer()
    }

    const openFullscreen = () => {
        setIsFullscreen(true)
        Orientation.lockToLandscape()
        resetHideTimer()
        if (paused) setActiveVideoId(videoId)
    }

    const exitFullscreen = () => {
        const resumeAt = currentTimeRef.current
        setIsFullscreen(false)
        Orientation.lockToPortrait()
        setTimeout(() => {
            videoRef.current?.seek(resumeAt)
        }, 150)
    }

    const renderControls = (isFS) => (
        <View style={[styles.controls, isFS && styles.controls_fs]}>

            <View style={[styles.top_row, { marginTop: responsiveWidth(1) }]}>
                <TouchableOpacity
                    onPress={toggleMute}
                    style={[styles.icon_btn, { backgroundColor: isFS ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }]}
                >
                    <Image
                        source={muted ? globalImages.mute : globalImages.volume}
                        style={styles.icon_img}
                        tintColor={COLOURS.white}
                    />
                </TouchableOpacity>

                {fullshow && (
                    <TouchableOpacity
                        onPress={isFS ? exitFullscreen : openFullscreen}
                        style={[isFS ? styles.full_btn : styles.full_btn_big, { backgroundColor: isFS ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }]}
                    >
                        <Image
                            source={isFS ? globalImages.minimize_icon : globalImages.maximize_icon}
                            style={isFS ? styles.icon_img_big : styles.icon_img}
                            tintColor={COLOURS.white}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                onPress={togglePlay}
                activeOpacity={0.8}
                style={[styles.center_btn, { backgroundColor: isFS ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }]}
            >
                <Image
                    source={paused ? globalImages.play : globalImages.pause}
                    style={styles.icon_pause}
                    tintColor={COLOURS.white}
                />
            </TouchableOpacity>

            <View style={styles.bottom_row}>
                <Text style={styles.time}>{formatTime(currentTime)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration > 0 ? duration : 1}
                    // ✅ sliderValue use karo — video progress se alag
                    value={sliderValue}
                    onSlidingStart={onSliderStart}
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
            <View style={[styles.wrapper, style]}>
                <Video
                    ref={videoRef}
                    source={{ uri }}
                    style={styles.video}
                    paused={isFullscreen ? true : paused}
                    muted={muted}
                    resizeMode="cover"
                    onLoad={onLoad}
                    onProgress={onProgress}
                    onEnd={onEnd}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch="obey"
                    maxBitRate={2000000}
                    progressUpdateInterval={300}
                    reportBandwidth={false}
                />

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
                        onLoad={onFullscreenLoad}
                        onProgress={onFullscreenProgress}
                        onEnd={onEnd}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch="obey"
                        maxBitRate={2000000}
                        progressUpdateInterval={300}
                        reportBandwidth={false}
                    />

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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: responsiveWidth(2),
    },
    icon_btn: {
        padding: responsiveWidth(2),
        borderRadius: responsiveWidth(100),
    },
    full_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: responsiveWidth(1),
        borderRadius: responsiveWidth(100),
    },

    full_btn_big: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: responsiveWidth(2),
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
    icon_img_big : {
        height: responsiveWidth(6),
        width: responsiveWidth(6),
    },
})