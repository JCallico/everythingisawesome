import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

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

  const formatShortDate = (dateString) => {
    const date = parseDate(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
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
          isToday && styles.calendarDayToday
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
            isToday && styles.calendarDayTextToday
          ]}>
            {day}
          </Text>
          {isActive && (
            <View style={[
              styles.calendarDayDot,
              isSelected && styles.calendarDayDotSelected
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

  const renderListItem = ({ item: date, index }) => {
    const isSelected = date === selectedDate;
    const isLatestDate = isLatest(date, index);
    const isTodayDate = isToday(date);

    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          isSelected && styles.listItemSelected,
          isLatestDate && styles.listItemLatest
        ]}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <BlurView intensity={isSelected ? 30 : 20} style={styles.listItemBlur}>
          <View style={styles.listItemContent}>
            <Text style={[
              styles.listItemDate,
              isSelected && styles.listItemDateSelected,
              isLatestDate && styles.listItemDateLatest
            ]}>
              {formatShortDate(date)}
            </Text>
            <Text style={[
              styles.listItemSubtext,
              isSelected && styles.listItemSubtextSelected,
              isLatestDate && styles.listItemSubtextLatest
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
    
    // Get the first day of the month and its weekday (0 = Sunday, 6 = Saturday)
    const firstDay = new Date(year, month, 1);
    const firstDayWeekday = firstDay.getDay();
    
    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Generate the actual days for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentCalendarDate = new Date(year, month, day);
      const dateString = formatDateToString(currentCalendarDate);
      const hasNews = hasNewsForDate(dateString);
      const isSelected = dateString === selectedDate;
      const isToday = dateString === formatDateToString(new Date());
      
      days.push({
        date: new Date(currentCalendarDate),
        dateString,
        isCurrentMonth: true,
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
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  modal: {
    flex: 1
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    position: 'relative'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 60, // Add padding to prevent overlap with close button
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  subtitle: {
    color: '#2c2c2c',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    elevation: 8,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    top: 10,
    width: 40,
    zIndex: 1000
  },
  closeButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold'
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    color: '#1a1a1a',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  statLabel: {
    color: '#2c2c2c',
    fontSize: 12,
    marginTop: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  dateList: {
    flex: 1
  },
  dateListContent: {
    padding: 20,
    paddingTop: 0
  },
  row: {
    justifyContent: 'space-between'
  },
  listHeader: {
    color: '#1a1a1a',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  emptySubtext: {
    color: '#2c2c2c',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  // Calendar styles
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  calendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  calendarNavButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  calendarNavButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  calendarTitle: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  calendarDaysHeader: {
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingVertical: 10
  },
  calendarDayHeaderText: {
    color: '#2c2c2c',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    width: (width - 40) / 7
  },
  calendarScrollView: {
    flex: 1
  },
  calendarGrid: {
    paddingBottom: 20
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5
  },
  calendarDay: {
    alignItems: 'center',
    borderRadius: 8,
    height: (width - 40) / 7,
    justifyContent: 'center',
    width: (width - 40) / 7
  },
  calendarDayEmpty: {
    alignItems: 'center',
    height: (width - 40) / 7,
    justifyContent: 'center',
    width: (width - 40) / 7
  },
  calendarDayEmptyText: {
    color: '#666',
    fontSize: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  calendarDayActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  calendarDaySelected: {
    backgroundColor: '#FFD700',
    borderColor: '#fff',
    borderWidth: 2
  },
  calendarDayToday: {
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2
  },
  calendarDayContent: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%'
  },
  calendarDayText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  calendarDayTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  calendarDayTextSelected: {
    color: '#333',
    fontWeight: 'bold'
  },
  calendarDayTextToday: {
    fontWeight: 'bold'
  },
  calendarDayDot: {
    backgroundColor: '#FFD700',
    borderRadius: 2,
    height: 4,
    marginTop: 2,
    width: 4
  },
  calendarDayDotSelected: {
    backgroundColor: '#333'
  },
  // List styles (updated from original dateItem styles)
  listItem: {
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    width: '48%'
  },
  listItemBlur: {
    borderRadius: 15
  },
  listItemContent: {
    alignItems: 'center',
    padding: 15,
    position: 'relative'
  },
  listItemSelected: {
    borderColor: '#FFD700',
    borderWidth: 2
  },
  listItemLatest: {
    borderColor: 'rgba(255, 215, 0, 0.6)',
    borderWidth: 2
  },
  listItemDate: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  listItemDateSelected: {
    color: '#FFD700',
    fontWeight: 'bold'
  },
  listItemDateLatest: {
    color: '#FFD700'
  },
  listItemSubtext: {
    color: '#2c2c2c',
    fontSize: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  listItemSubtextSelected: {
    color: '#FFD700',
    opacity: 1
  },
  listItemSubtextLatest: {
    color: '#FFD700',
    opacity: 0.9
  }
});

export default DateSelector;
