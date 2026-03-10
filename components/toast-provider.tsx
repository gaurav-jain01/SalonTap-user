import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const TOAST_CONFIG: Record<ToastType, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  success: { icon: 'checkmark-circle', color: '#4CAF50', bg: '#E8F5E9' },
  error: { icon: 'close-circle', color: '#F44336', bg: '#FFEBEE' },
  info: { icon: 'information-circle', color: '#2196F3', bg: '#E3F2FD' },
  warning: { icon: 'warning', color: '#FF9800', bg: '#FFF3E0' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState<ToastConfig>({ message: '', type: 'success' });
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setVisible(false));
  }, [translateY, opacity]);

  const showToast = useCallback((config: ToastConfig) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(config);
    setVisible(true);

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, config.duration || 3000);
  }, [translateY, opacity, hideToast]);

  const config = TOAST_CONFIG[toast.type || 'success'];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            { transform: [{ translateY }], opacity, backgroundColor: config.bg, borderLeftColor: config.color },
          ]}
        >
          <Ionicons name={config.icon} size={24} color={config.color} />
          <Text style={[styles.toastMessage, { color: config.color }]}>{toast.message}</Text>
          <TouchableOpacity onPress={hideToast} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={20} color={config.color} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    gap: Spacing.md,
    zIndex: 9999,
    ...Shadows.lg,
  },
  toastMessage: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
