import { useRef } from "react";
import LottieView from "lottie-react-native";

export const PlayLottie = ({ source, size }) => {
    const ref = useRef(null);
    const playCount = useRef(0);

    return (
        <LottieView
            ref={ref}
            source={source}
            style={{ width: size, height: size }}
            loop={false}
            onLayout={() => {
                playCount.current = 0;
                ref.current?.play();
            }}
            onAnimationFinish={() => {
                playCount.current += 1;
                if (playCount.current < 2) {
                    ref.current?.reset();
                    ref.current?.play();
                }
            }}
        />
    );
};