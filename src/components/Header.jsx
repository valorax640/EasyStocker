import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../constants/colors';

const Header = ({title, leftAction, rightAction}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {leftAction && (
          <TouchableOpacity onPress={leftAction. onPress} style={styles.actionButton}>
            <Text style={styles.actionText}>{leftAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} style={styles. actionButton}>
            <Text style={styles.actionText}>{rightAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors. border,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    color: colors.primary,
    fontSize: 16,
  },
});

export default Header;