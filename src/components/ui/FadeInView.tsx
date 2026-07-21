import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type FadeInViewProps = PropsWithChildren<{
  // Ritardo progressivo in base alla posizione nella lista (effetto a cascata).
  index?: number;
  style?: StyleProp<ViewStyle>;
}>;

export default function FadeInView({
  index = 0,
  style,
  children,
}: FadeInViewProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      // Cap del ritardo per non rallentare la comparsa con liste lunghe.
      delay: Math.min(index * 60, 300),
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  const animatedStyle = {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
