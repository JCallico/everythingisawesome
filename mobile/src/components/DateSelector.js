import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  FlatList,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const DateSelector = ({ 
  visible, 
  onClose, 
  availableDates = [], 
  currentDate = null, 
  onDateSelect 
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  // Utility function to parse date string without timezone issues
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDisplayDate = (dateString) => {
    const date = parseDate(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatShortDate = (dateString) => {
    const date = parseDate(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatYearMonth = (dateString) => {
    const date = parseDate(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = parseDate(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isLatest = (dateString, index) => {
    return index === 0; // Assuming the first date is the latest
  };

  const getDaysAgo = (dateString) => {
    const today = new Date();
    const date = parseDate(dateString);
    const diffTime = today - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleDatePress = (date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDate(date);
    onDateSelect(date);
    onClose();
  };

  const renderDateItem = ({ item: date, index }) => {
    const isSelected = date === selectedDate;
    const isLatestDate = isLatest(date, index);
    const isTodayDate = isToday(date);

    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          isSelected && styles.dateItemSelected,
          isLatestDate && styles.dateItemLatest,
        ]}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <BlurView intensity={isSelected ? 30 : 20} style={styles.dateItemBlur}>
          <View style={styles.dateItemContent}>
            <Text style={[
              styles.dateText,
              isSelected && styles.dateTextSelected,
              isLatestDate && styles.dateTextLatest,
            ]}>
              {formatShortDate(date)}
            </Text>
            <Text style={[
              styles.dateSubtext,
              isSelected && styles.dateSubtextSelected,
              isLatestDate && styles.dateSubtextLatest,
            ]}>
              {getDaysAgo(date)}
            </Text>
            {isLatestDate && (
              <View style={styles.latestBadge}>
                <Text style={styles.latestBadgeText}>✨ Latest</Text>
              </View>
            )}
            {isTodayDate && !isLatestDate && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>Today</Text>
              </View>
            )}
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <BlurView intensity={100} style={styles.container}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Browse News by Date</Text>
            <Text style={styles.subtitle}>
              {availableDates.length} days of positive news available
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Quick stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{availableDates.length}</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {availableDates.length > 0 ? Math.ceil(availableDates.length / 7) : 0}
              </Text>
              <Text style={styles.statLabel}>Weeks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Awesome</Text>
            </View>
          </View>

          {/* Date List */}
          <FlatList
            data={availableDates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item}
            style={styles.dateList}
            contentContainerStyle={styles.dateListContent}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
            ListHeaderComponent={() => (
              <Text style={styles.listHeader}>
                📅 Select a date to explore that day's awesome news
              </Text>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No dates available</Text>
                <Text style={styles.emptySubtext}>Check back later for more awesome news!</Text>
              </View>
            )}
          />
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.95)',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  dateList: {
    flex: 1,
  },
  dateListContent: {
    padding: 20,
    paddingTop: 0,
  },
  row: {
    justifyContent: 'space-between',
  },
  listHeader: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  dateItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  dateItemBlur: {
    borderRadius: 15,
  },
  dateItemContent: {
    padding: 15,
    alignItems: 'center',
    position: 'relative',
  },
  dateItemSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dateItemLatest: {
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  dateTextSelected: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  dateTextLatest: {
    color: '#FFD700',
  },
  dateSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
  },
  dateSubtextSelected: {
    color: '#FFD700',
    opacity: 1,
  },
  dateSubtextLatest: {
    color: '#FFD700',
    opacity: 0.9,
  },
  latestBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  latestBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  todayBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  todayBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default DateSelector;
