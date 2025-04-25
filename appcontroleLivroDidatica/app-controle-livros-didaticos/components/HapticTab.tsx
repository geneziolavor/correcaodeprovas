import * as Haptics from 'expo-haptics';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { accessibilityState, ...rest } = props;
  
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.(e);
      }}
    />
  );
}
