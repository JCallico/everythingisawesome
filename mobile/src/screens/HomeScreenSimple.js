import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Alert,
  Linking,
  Share,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// API configuration
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:3001/api';
  }
  return 'https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/api';
};

const getImageBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:3001';
  }
  return 'https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net';
};

// Theme colors mapping - exactly like web version
const THEME_COLORS = {
  hope: ['#FFD700', '#FFA500', '#FF6347'],
  health: ['#32CD32', '#20B2AA', '#4169E1'],
  innovation: ['#9B59B6', '#8E44AD'],
  education: ['#FF6347', '#FFD700', '#32CD32'],
  community: ['#E74C3C', '#C0392B'],
  science: ['#4A90E2', '#357ABD'],
  arts: ['#9B59B6', '#8E44AD'],
  entertainment: ['#FFD700', '#FFA500'],
  business: ['#34495E', '#2C3E50'],
  sports: ['#E67E22', '#D35400'],
  travel: ['#11998e', '#38ef7d'],
  food: ['#FFA500', '#FFD700'],
  lifestyle: ['#667eea', '#764ba2'],
  nature: ['#11998e', '#38ef7d'],
  politics: ['#4A90E2', '#357ABD'],
  economy: ['#FFD700', '#FFA500'],
  world: ['#20B2AA', '#4169E1'],
  inspiring: ['#FFD700', '#FF69B4'],
  default: ['#667eea', '#764ba2'],
};

const fetchLatestNews = async () => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/news/latest`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    throw new Error('Failed to fetch latest news');
  }
};

const fetchAvailableDates = async () => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/news/dates`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw new Error('Failed to fetch available dates');
  }
};

const fetchNewsForDate = async (date) => {
  try {
    const response = await axios.get(`${getApiBaseUrl()}/news/${date}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news for date:', error);
    throw new Error('Failed to fetch news for date');
  }
};

const HomeScreen = ({ navigation }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [showDateSelector, setShowDateSelector] = useState(false);
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const autoRotateTimer = useRef(null);

  useEffect(() => {
    loadLatestNews();
    loadAvailableDates();
  }, []);

  // Auto transition effect - exactly like web version
  useEffect(() => {
    if (news && news.stories && news.stories.length > 1 && !isPaused) {
      startAutoRotation();
    }
    return () => {
      if (autoRotateTimer.current) {
        clearInterval(autoRotateTimer.current);
      }
    };
  }, [news, isPaused, currentIndex]);

  // Pulse animation for loading
  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [loading, pulseAnim]);

  const loadLatestNews = async () => {
    try {
      setLoading(true);
      const data = await fetchLatestNews();
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load latest news. Please try again later.');
      console.error('Error loading latest news:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDates = async () => {
    try {
      const dates = await fetchAvailableDates();
      setAvailableDates(dates || []);
    } catch (err) {
      console.error('Error loading available dates:', err);
    }
  };

  const loadNewsForDate = async (date) => {
    try {
      setLoading(true);
      setCurrentIndex(0); // Reset to first story
      const data = await fetchNewsForDate(date);
      setNews(data);
      setError(null);
    } catch (err) {
      setError(`Failed to load news for ${date}. Please try again later.`);
      console.error('Error loading news for date:', err);
    } finally {
      setLoading(false);
    }
  };

  const startAutoRotation = () => {
    if (autoRotateTimer.current) {
      clearInterval(autoRotateTimer.current);
    }
    
    autoRotateTimer.current = setInterval(() => {
      if (news && news.stories && news.stories.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.stories.length);
      }
    }, 30000); // 30 seconds - same as web
  };

  const pauseAutoRotation = () => {
    setIsPaused(true);
    if (autoRotateTimer.current) {
      clearInterval(autoRotateTimer.current);
    }
  };

  const resumeAutoRotation = () => {
    setIsPaused(false);
  };

  const changeStory = (newIndex, direction = 'right') => {
    if (newIndex === currentIndex) return;
    
    // Animate transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'right' ? -50 : 50,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentIndex(newIndex);
  };

  const goToPrevious = () => {
    if (!news || !news.stories || news.stories.length <= 1) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newIndex = currentIndex === 0 ? news.stories.length - 1 : currentIndex - 1;
    changeStory(newIndex, 'left');
  };

  const goToNext = () => {
    if (!news || !news.stories || news.stories.length <= 1) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newIndex = (currentIndex + 1) % news.stories.length;
    changeStory(newIndex, 'right');
  };

  const openStoryLink = async (url) => {
    if (!url) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const shareStory = async (story) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const message = `Check out this awesome story! 🌟\n\n${story.title}\n\n${story.summary}\n\nAwesome Score: ${story.awesome_index}/100\n\nRead more: ${story.link}`;
      
      await Share.share({
        message: message,
        title: story.title,
        url: story.link,
      });
    } catch (error) {
      console.error('Error sharing story:', error);
      Alert.alert('Share Error', 'Unable to share story at this time');
    }
  };

  const navigateToStory = (story, index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Story', {
      story: story,
      date: news.date,
      index: index
    });
  };

  // Swipe gesture handling - exactly like web navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const minSwipeDistance = 50;
        
        if (Math.abs(dx) > minSwipeDistance && Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            goToPrevious();
          } else {
            goToNext();
          }
        }
      },
    })
  ).current;

  const getStoryImage = (story) => {
    if (story.image && story.image !== 'placeholder') {
      return `${getImageBaseUrl()}${story.image}`;
    }
    const theme = story.theme || 'hope';
    return `${getImageBaseUrl()}/generated-images/fallback-${theme}.png`;
  };

  const getThemeColors = (story) => {
    const theme = story.theme || 'hope';
    return THEME_COLORS[theme] || THEME_COLORS.default;
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateSelect = (selectedDate) => {
    setShowDateSelector(false);
    if (selectedDate !== news?.date) {
      loadNewsForDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <ActivityIndicator size="large" color="#fff" />
            </Animated.View>
            <Text style={styles.loadingText}>Loading awesome news...</Text>
            <Text style={styles.loadingSubtext}>✨ Preparing positivity ✨</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadLatestNews}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!news || !news.stories || news.stories.length === 0) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No news available yet. Check back later!</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentStory = news.stories[currentIndex];
  const themeColors = getThemeColors(currentStory);

  return (
    <LinearGradient
      colors={themeColors}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header - exactly like web */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Everything Is</Text>
            <Text style={styles.titleAwesome}>Awesome</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerDate}>{news.title}</Text>
            <Text style={styles.headerCounter}>
              {currentIndex + 1} of {news.stories.length}
            </Text>
            {availableDates.length > 1 && (
              <TouchableOpacity 
                onPress={() => setShowDateSelector(true)}
                style={styles.dateSelectButton}
              >
                <Text style={styles.dateSelectButtonText}>📅 Browse Dates</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            onPress={isPaused ? resumeAutoRotation : pauseAutoRotation}
            style={styles.pauseBtn}
          >
            <Text style={styles.pauseBtnText}>{isPaused ? '▶️' : '⏸️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Story Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={pauseAutoRotation}
          onScrollEndDrag={resumeAutoRotation}
        >
          <Animated.View 
            {...panResponder.panHandlers}
            style={[
              styles.storyContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            {/* Progress indicators - exactly like web */}
            <View style={styles.progressContainer}>
              {news.stories.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentIndex && styles.progressDotActive
                  ]}
                  onPress={() => changeStory(index)}
                />
              ))}
            </View>

            {/* Awesome Index Badge - exactly like web */}
            <View style={styles.awesomeIndexContainer}>
              <BlurView intensity={20} style={styles.awesomeIndexBadge}>
                <Text style={styles.awesomeIndexText}>
                  ⭐ {currentStory.awesome_index}/100 Awesome
                </Text>
              </BlurView>
            </View>

            {/* Story Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: getStoryImage(currentStory) }}
                style={styles.storyImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.imageGradient}
              />
            </View>

            {/* Story Content */}
            <BlurView intensity={20} style={styles.contentCard}>
              <View style={styles.cardContent}>
                <TouchableOpacity 
                  onPress={() => navigateToStory(currentStory, currentIndex)}
                  style={styles.storyContentArea}
                  activeOpacity={0.7}
                >
                  <Text style={styles.storyTitle}>{currentStory.title}</Text>
                  <Text style={styles.storySummary}>{currentStory.summary}</Text>
                </TouchableOpacity>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigateToStory(currentStory, currentIndex)}
                  >
                    <Text style={styles.actionButtonText}>👁️ Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openStoryLink(currentStory.link)}
                  >
                    <Text style={styles.actionButtonText}>📖 Read</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.shareButton]}
                    onPress={() => shareStory(currentStory)}
                  >
                    <Text style={styles.actionButtonText}>📤 Share</Text>
                  </TouchableOpacity>
                </View>

                {/* Theme Badge */}
                <View style={styles.themeBadge}>
                  <Text style={styles.themeBadgeText}>
                    🏷️ {(currentStory.theme || 'hope').charAt(0).toUpperCase() + (currentStory.theme || 'hope').slice(1)}
                  </Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>

        {/* Navigation Controls - exactly like web */}
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={goToPrevious}
            style={[styles.navButton, styles.prevButton]}
          >
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPaused ? resumeAutoRotation : pauseAutoRotation}
            style={[styles.navButton, styles.pauseButton]}
          >
            <Text style={styles.navButtonText}>{isPaused ? '▶' : '⏸'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNext}
            style={[styles.navButton, styles.nextButton]}
          >
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Date Selector Modal */}
        {showDateSelector && (
          <View style={styles.dateModal}>
            <BlurView intensity={100} style={styles.dateModalContent}>
              <View style={styles.dateModalHeader}>
                <Text style={styles.dateModalTitle}>📅 Browse News by Date</Text>
                <TouchableOpacity 
                  onPress={() => setShowDateSelector(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.datesList}
                contentContainerStyle={styles.datesListContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.dateListHeader}>
                  {availableDates.length} days of awesome news available
                </Text>
                
                {availableDates.map((date, index) => (
                  <TouchableOpacity
                    key={date}
                    style={[
                      styles.dateItem,
                      date === news?.date && styles.dateItemActive
                    ]}
                    onPress={() => handleDateSelect(date)}
                  >
                    <View style={styles.dateItemContent}>
                      <Text style={[
                        styles.dateItemText,
                        date === news?.date && styles.dateItemTextActive
                      ]}>
                        {formatShortDate(date)}
                      </Text>
                      {index === 0 && (
                        <View style={styles.latestBadge}>
                          <Text style={styles.latestBadgeText}>Latest</Text>
                        </View>
                      )}
                      {date === news?.date && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>Current</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </BlurView>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#fff',
  },
  titleAwesome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerInfo: {
    flex: 2,
    alignItems: 'center',
  },
  headerDate: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerCounter: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
  pauseBtn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pauseBtnText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  storyContainer: {
    flex: 1,
    minHeight: height - 200,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#FFD700',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  awesomeIndexContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 10,
  },
  awesomeIndexBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  awesomeIndexText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    height: height * 0.4,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  contentCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardContent: {
    padding: 20,
  },
  storyContentArea: {
    marginBottom: 20,
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 28,
  },
  storySummary: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shareButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  themeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  themeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  prevButton: {},
  nextButton: {},
  pauseButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateSelectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dateSelectButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  dateModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dateModalContent: {
    backgroundColor: 'rgba(102, 126, 234, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  dateModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datesList: {
    flex: 1,
  },
  datesListContent: {
    padding: 20,
    paddingTop: 0,
  },
  dateListHeader: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 15,
  },
  dateItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateItemActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  dateItemContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  dateItemTextActive: {
    color: '#FFD700',
  },
  latestBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  latestBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  currentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
