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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const DateSelector = ({ 
  visible, 
  onClose, 
  availableDates = [], 
  currentDate = null, 
  onDateSelect,
  themeColors = ['#667eea', '#764ba2'] // Default gradient if no theme provided
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [isReady, setIsReady] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list' - default to calendar

  useEffect(() => {
    setSelectedDate(currentDate);
    // Set the current view to the month of the current/selected date, or latest available
    if (currentDate) {
      const date = parseDate(currentDate);
      setCurrentViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    } else if (availableDates.length > 0) {
      // If no current date, show the month of the most recent available date
      const latestDate = parseDate(availableDates[0]);
      setCurrentViewDate(new Date(latestDate.getFullYear(), latestDate.getMonth(), 1));
    }
  }, [currentDate, availableDates]);

  useEffect(() => {
    if (visible) {
      // Small delay to ensure SafeAreaView has calculated insets
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [visible]);

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

  const handleClose = () => {
    onClose();
  };

  const handleDatePress = (date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDate(date);
    onDateSelect(date);
    onClose();
  };

  const renderCalendarDay = (dayInfo) => {
    const { dateString, hasNews, isSelected, isToday, day } = dayInfo;
    
    const isActive = hasNews;
    
    return (
      <TouchableOpacity
        key={dateString}
        style={[
          styles.calendarDay,
          isActive && styles.calendarDayActive,
          isSelected && styles.calendarDaySelected,
          isToday && styles.calendarDayToday,
        ]}
        onPress={() => isActive ? handleDatePress(dateString) : null}
        activeOpacity={isActive ? 0.7 : 1}
        disabled={!isActive}
      >
        <View style={styles.calendarDayContent}>
          <Text style={[
            styles.calendarDayText,
            isActive && styles.calendarDayTextActive,
            isSelected && styles.calendarDayTextSelected,
            isToday && styles.calendarDayTextToday,
          ]}>
            {day}
          </Text>
          {isActive && (
            <View style={[
              styles.calendarDayDot,
              isSelected && styles.calendarDayDotSelected,
            ]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCalendarGrid = () => {
    const days = getCalendarDays();
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7);
      
      // Fill remaining slots with empty cells to maintain 7-day grid
      while (week.length < 7) {
        week.push(null);
      }
      
      weeks.push(
        <View key={i} style={styles.calendarWeek}>
          {week.map((dayInfo, index) => 
            dayInfo ? renderCalendarDay(dayInfo) : (
              <View key={`empty-${i}-${index}`} style={styles.calendarDay} />
            )
          )}
        </View>
      );
    }
    
    return weeks;
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'calendar' ? 'list' : 'calendar');
  };

  const renderListItem = ({ item: date, index }) => {
    const isSelected = date === selectedDate;
    const isLatestDate = isLatest(date, index);
    const isTodayDate = isToday(date);

    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          isSelected && styles.listItemSelected,
          isLatestDate && styles.listItemLatest,
        ]}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <BlurView intensity={isSelected ? 30 : 20} style={styles.listItemBlur}>
          <View style={styles.listItemContent}>
            <Text style={[
              styles.listItemDate,
              isSelected && styles.listItemDateSelected,
              isLatestDate && styles.listItemDateLatest,
            ]}>
              {formatShortDate(date)}
            </Text>
            <Text style={[
              styles.listItemSubtext,
              isSelected && styles.listItemSubtextSelected,
              isLatestDate && styles.listItemSubtextLatest,
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

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentViewDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentViewDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const hasNewsForDate = (dateString) => {
    return availableDates.includes(dateString);
  };

  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCalendarDays = () => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate only the days for the current month
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentCalendarDate = new Date(year, month, day);
      const dateString = formatDateToString(currentCalendarDate);
      const hasNews = hasNewsForDate(dateString);
      const isSelected = dateString === selectedDate;
      const isToday = dateString === formatDateToString(new Date());
      
      days.push({
        date: new Date(currentCalendarDate),
        dateString,
        isCurrentMonth: true, // All days are current month now
        hasNews,
        isSelected,
        isToday,
        day: day
      });
    }
    
    return days;
  };

  const getMonthYearText = () => {
    return currentViewDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getAvailableMonths = () => {
    const months = new Set();
    availableDates.forEach(dateString => {
      const date = parseDate(dateString);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthYear);
    });
    return Array.from(months).sort().reverse(); // Most recent first
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <LinearGradient
        colors={themeColors}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {isReady && (
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Browse News by Date</Text>
                <Text style={styles.subtitle}>
                  {availableDates.length} days of positive news available
                </Text>
                <TouchableOpacity 
                  onPress={handleClose} 
                  style={styles.closeButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
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
              {viewMode === 'list' ? (
                <FlatList
                  data={availableDates}
                  renderItem={renderListItem}
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
              ) : (
                <View style={styles.calendarContainer}>
                  {/* Calendar Header */}
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={goToPreviousMonth} style={styles.calendarNavButton}>
                      <Text style={styles.calendarNavButtonText}>◀</Text>
                    </TouchableOpacity>
                    <Text style={styles.calendarTitle}>{getMonthYearText()}</Text>
                    <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavButton}>
                      <Text style={styles.calendarNavButtonText}>▶</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Calendar Days Header */}
                  <View style={styles.calendarDaysHeader}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <Text key={day} style={styles.calendarDayHeaderText}>{day}</Text>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <ScrollView style={styles.calendarScrollView}>
                    <View style={styles.calendarGrid}>
                      {renderCalendarGrid()}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  modal: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#2c2c2c',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  closeButtonText: {
    color: '#121212',
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
    color: '#1a1a1a',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#2c2c2c',
    marginTop: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#2c2c2c',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  // Calendar styles
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarNavButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  calendarTitle: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  calendarDayHeaderText: {
    color: '#2c2c2c',
    fontSize: 12,
    fontWeight: '600',
    width: (width - 40) / 7,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  calendarScrollView: {
    flex: 1,
  },
  calendarGrid: {
    paddingBottom: 20,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  calendarDay: {
    width: (width - 40) / 7,
    height: (width - 40) / 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  calendarDayEmpty: {
    width: (width - 40) / 7,
    height: (width - 40) / 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayEmptyText: {
    color: '#666',
    fontSize: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  calendarDayActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  calendarDaySelected: {
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#fff',
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  calendarDayContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  calendarDayText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  calendarDayTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  calendarDayTextSelected: {
    color: '#333',
    fontWeight: 'bold',
  },
  calendarDayTextToday: {
    fontWeight: 'bold',
  },
  calendarDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    marginTop: 2,
  },
  calendarDayDotSelected: {
    backgroundColor: '#333',
  },
  // List styles (updated from original dateItem styles)
  listItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  listItemBlur: {
    borderRadius: 15,
  },
  listItemContent: {
    padding: 15,
    alignItems: 'center',
    position: 'relative',
  },
  listItemSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  listItemLatest: {
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  listItemDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listItemDateSelected: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  listItemDateLatest: {
    color: '#FFD700',
  },
  listItemSubtext: {
    fontSize: 12,
    color: '#2c2c2c',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  listItemSubtextSelected: {
    color: '#FFD700',
    opacity: 1,
  },
  listItemSubtextLatest: {
    color: '#FFD700',
    opacity: 0.9,
  },
});

export default DateSelector;
