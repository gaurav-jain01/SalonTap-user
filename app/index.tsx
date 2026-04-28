import { Colors } from "@/constants/theme";
import { addressService } from "@/services/addressService";
import { useAddressStore } from "@/stores/userAddressStore";
import { getToken } from "@/utils/auth";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Index() {
    const router = useRouter();
    const logoScale = useSharedValue(0.3);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const textTranslateY = useSharedValue(20);
    const pulseValue = useSharedValue(1);

    useEffect(() => {
        // Entrance animation
        logoScale.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.back(1.5)),
        });
        logoOpacity.value = withTiming(1, { duration: 800 });

        textOpacity.value = withDelay(
            800,
            withTiming(1, { duration: 600 })
        );
        textTranslateY.value = withDelay(
            800,
            withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) })
        );

        // Continuous pulse for the logo
        pulseValue.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        );

        const start = Date.now();

        const run = async () => {
            const nextRoute = await initApp();

            const elapsed = Date.now() - start;
            const remaining = 2500 - elapsed;

            if (remaining > 0) {
                setTimeout(() => {
                    router.replace(nextRoute as any);
                }, remaining);
            } else {
                router.replace(nextRoute as any);
            }
        };

        run();
    }, []);

    const initApp = async () => {
        try {
            const token = await getToken();

            if (!token) {
                return "/login";
            }

            // fetch addresses
            const res = await addressService.fetchAddresses();
            useAddressStore.getState().setAddressList(res);

            const defaultAddress =
                res.find((a: { isDefault: any; }) => a.isDefault) || res[0];

            if (defaultAddress) {
                useAddressStore.getState().setSelectedAddress(defaultAddress);
            }

            return "/(tabs)";
        } catch (err) {
            return "/login";
        }
    };

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: logoScale.value * pulseValue.value },
        ],
        opacity: logoOpacity.value,
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Background Decorative Circles */}
            <View style={styles.decorator1} />
            <View style={styles.decorator2} />

            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <Image
                    source={require("../assets/images/icon.png")}
                    style={styles.logo}
                    contentFit="contain"
                />
            </Animated.View>

            <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
                <Text style={styles.title}>SalonTap</Text>
                <Text style={styles.subtitle}>Beauty & Wellness at your doorstep</Text>
            </Animated.View>

            <View style={styles.footer}>
                <View style={styles.loadingBarContainer}>
                    <Animated.View style={styles.loadingBar} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    decorator1: {
        position: "absolute",
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: Colors.primaryLight + "10", // Low opacity
    },
    decorator2: {
        position: "absolute",
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: Colors.primary + "05", // Very low opacity
    },
    logoContainer: {
        width: 160,
        height: 160,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 5,
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    textContainer: {
        marginTop: 40,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: Colors.primary,
        letterSpacing: 2,
        textTransform: "uppercase",
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 8,
        fontWeight: "500",
        letterSpacing: 1,
    },
    footer: {
        position: "absolute",
        bottom: 60,
        width: "100%",
        alignItems: "center",
    },
    loadingBarContainer: {
        width: width * 0.4,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        overflow: "hidden",
    },
    loadingBar: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.primary,
    },
});