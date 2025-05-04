import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useEffect } from 'react';
import Colors from '../constants/Colors';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onComplete?: () => void;
}

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps,
  onComplete
}: ProgressIndicatorProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const newProgress = currentStep / totalSteps;
    
    progress.value = withTiming(newProgress, { duration: 300 }, (finished) => {
      if (finished && newProgress === 1 && onComplete) {
        runOnJS(onComplete)();
      }
    });
  }, [currentStep, totalSteps, onComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
  },
});