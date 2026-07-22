import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const CIRCLE_SIZE = 200;

export default function WaterProgressCircle({
  percentage,
  total,
  goal,
}: {
  percentage: number;
  total: number;
  goal: number;
}) {
  const { theme } = useTheme();
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage, fillAnim]);

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, CIRCLE_SIZE],
  });

  return (
    <View
      style={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: theme.colors.surfaceAlt,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignSelf: "center",
        overflow: "hidden",
        marginBottom: theme.spacing.lg,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: fillHeight,
          backgroundColor: theme.colors.primary,
        }}
      />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.colors.text, ...theme.text.h1 }}>
          {percentage}%
        </Text>
        <Text
          style={{
            color: theme.colors.text,
            marginTop: theme.spacing.xs,
            ...theme.text.caption,
          }}
        >
          {total} / {goal} ml
        </Text>
      </View>
    </View>
  );
}
