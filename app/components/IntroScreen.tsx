import { Audio } from 'expo-av';
import React, { useEffect, useRef } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function IntroScreen({ onFinish }: { onFinish: () => void }) {
  const sound = useRef(new Audio.Sound()).current;
  const blink = useSharedValue(1);

  // Blinking "Tap to Start" animation
  const blinkStyle = useAnimatedStyle(() => ({
    opacity: blink.value,
  }));

  useEffect(() => {
    // Start blinking immediately
    blink.value = withRepeat(withTiming(0.2, { duration: 600 }), -1, true);

    // Load and play sound immediately
    const playAudio = async () => {
      try {
        await sound.loadAsync(require('../../assets/audio/intro_song.mp3'));
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
      } catch (error) {
        console.error("Couldn't play audio file. Check the path.", error);
      }
    };
    playAudio();

    return () => {
      sound.unloadAsync();
    };
  }, []);

  const handlePress = async () => {
    await sound.stopAsync();
    await sound.unloadAsync();
    onFinish();
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image source={require('../../assets/images/logo.jpg')} style={styles.logo} />
      <Text style={styles.title}>BadMonkey</Text>
      <Animated.Text style={[styles.tapText, blinkStyle]}>
        Tap to Start
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011d42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },
  tapText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 40,
    fontStyle: 'italic',
  },
});
