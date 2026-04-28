// components/VideoPlayer.js
import React, { useRef, useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native'
import Video from 'react-native-video'
import Slider from '@react-native-community/slider'
import { COLOURS } from '../assets/theme/Theme'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'
import { globalImages } from '../assets/images/images_file/All_Images';

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
}

const VideoPlayer = ({ uri, videoId, activeVideoId, setActiveVideoId, style }) => {

    const videoRef = useRef(null)
    const paused = activeVideoId !== videoId
    const [muted, setMuted] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [seeking, setSeeking] = useState(false)
    const [showControls, setShowControls] = useState(true) // ✅ add karo
    const hideTimeout = useRef(null) // ✅ add karo

    // ✅ Controls auto hide
    const resetHideTimer = () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current)
        setShowControls(true)
        hideTimeout.current = setTimeout(() => {
            setShowControls(false)
        }, 3000) // 3 second baad hide
    }

    // ✅ Jab video play ho to timer shuru karo
    useEffect(() => {
        if (!paused) {
            resetHideTimer()
        } else {
            if (hideTimeout.current) clearTimeout(hideTimeout.current)
            setShowControls(true) // paused ho to hamesha show
        }
        return () => {
            if (hideTimeout.current) clearTimeout(hideTimeout.current)
        }
    }, [paused])

    const togglePlay = () => {
        if (paused) {
            setActiveVideoId(videoId)
        } else {
            setActiveVideoId(null)
        }
    }

    const toggleMute = () => {
        setMuted(prev => !prev)
        resetHideTimer() // ✅ mute press karne par timer reset
    }

    const onLoad = (data) => setDuration(data.duration)

    const onProgress = (data) => {
        if (!seeking) setCurrentTime(data.currentTime)
    }

    const onEnd = () => {
        setActiveVideoId(null)
        setCurrentTime(0)
        videoRef.current?.seek(0)
    }

    const onSliderChange = (value) => {
        setSeeking(true)
        setCurrentTime(value)
        resetHideTimer() // ✅ slider use karne par timer reset
    }

    const onSliderComplete = (value) => {
        videoRef.current?.seek(value)
        setSeeking(false)
        resetHideTimer()
    }

    return (
        <View style={[styles.wrapper, style]}>
            <Video
                ref={videoRef}
                source={{ uri }}
                style={styles.video}
                paused={paused}
                muted={muted}
                resizeMode="cover"
                onLoad={onLoad}
                onProgress={onProgress}
                onEnd={onEnd}
                playInBackground={false}
                playWhenInactive={false}
            />

            {/* ✅ Touch anywhere on video to show/hide controls */}
            <TouchableOpacity
                style={StyleSheet.absoluteFillObject}
                activeOpacity={1}
                onPress={() => {
                    if (showControls) {
                        setShowControls(false)
                        if (hideTimeout.current) clearTimeout(hideTimeout.current)
                    } else {
                        resetHideTimer()
                        if (paused) togglePlay()
                    }
                }}
            />

            {/* Controls — sirf showControls true ho tab dikhao */}
            {showControls && (
                <View style={styles.controls} pointerEvents="box-none">

                    <View style={styles.top_row}>
                        <TouchableOpacity onPress={toggleMute} style={styles.icon_btn}>
                            <Image source={muted ? globalImages.mute : globalImages.volume} style={styles.icon_img} tintColor={COLOURS.white} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={togglePlay} style={styles.center_btn}>
                        <Image source={paused ? globalImages.play : globalImages.pause} style={styles.icon_pause} tintColor={COLOURS.white} />
                    </TouchableOpacity>

                    <View style={styles.bottom_row}>
                        <Text style={styles.time}>{formatTime(currentTime)}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
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
            )}
        </View>
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

    icon_pause: {
        height: responsiveWidth(7),
        width: responsiveWidth(7)
    },

    icon_img: {
        height: responsiveWidth(4),
        width: responsiveWidth(4)
    },

    controls: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: responsiveWidth(3),
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    top_row: {
        alignItems: 'flex-end',
    },
    icon_btn: {
        padding: responsiveWidth(1),
    },
    center_btn: {
        alignSelf: 'center',
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
    },
})