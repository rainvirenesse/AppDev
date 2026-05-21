import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/theme';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  onCartPress?: () => void;
  cartCount?: number;
  light?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBack,
  onCartPress,
  cartCount = 0,
  light = false,
}) => {
  const insets = useSafeAreaInsets();
  const textColor = light ? COLORS.white : COLORS.burgundy;
  const iconColor = light ? COLORS.white : COLORS.burgundy;

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={12}>
            <Text style={[styles.backIcon, { color: iconColor }]}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>

        {onCartPress ? (
          <TouchableOpacity onPress={onCartPress} style={styles.iconBtn} hitSlop={12}>
            <Text style={[styles.cartIcon, { color: iconColor }]}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cartIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.burgundy,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default AppHeader;
