import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  Alert,
  Linking,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import PagerView from 'react-native-pager-view';
import DateSelector from '../components/DateSelector';
import StoryCard from '../components/StoryCard';
import { 
  fetchLatestNews, 
  fetchAvailableDates, 
  fetchNewsByDate, 
  getImageBaseUrl
} from '../services/api';
import { Colors } from '../constants/colors';

// Theme colors mapping - exactly matching web version
const THEME_COLORS = {
  hope: ['#ff9a9e', '#fecfef', '#fecfef'],
  health: ['#fdbb2d', '#22c1c3'],
  innovation: ['#a8edea', '#fed6e3'],
  education: ['#b8c8ff', '#c4a8e3'],
  community: ['#89f7fe', '#66a6ff'],
  science: ['#7d6eec', '#9ca3f5', '#8a8fc7'],
  arts: ['#ff9a85', '#ffb8f6', '#f8a3f0'],
  entertainment: ['#ff3838', '#ff6b81', '#ff9ff3'],
  business: ['#3c40c6', '#575fcf', '#2c2c54'],
  sports: ['#ff9970', '#ffb85e', '#ff7a89'],
  travel: ['#00d2d3', '#54a0ff', '#5f27cd'],
  food: ['#ff9f43', '#feca57', '#ff6348'],
  lifestyle: ['#ff6b81', '#ff9ff3', '#a55eea'],
  nature: ['#d299c2', '#fef9d7'],
  politics: ['#2c2c54', '#40407a', '#706fd3'],
  economy: ['#218c74', '#33d9b2', '#2ed573'],
  world: ['#66c9ff', '#5db8ff', '#7ea4d3'],
  inspiring: ['#ff9a56', '#fad0c4', '#ffd1ff'],
  default: ['#ffecd2', '#fcb69f']
};

const HomeScreen = ({ navigation, route }) => {
  // Support both latest news and date-specific news via navigation params
  const { date: routeDate } = route.params || {};
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [pressedMenuItem, setPressedMenuItem] = useState(null);
  const [menuButtonPressed, setMenuButtonPressed] = useState(false);
  const [currentDate, setCurrentDate] = useState(routeDate || null);
  
  // Animation references
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const autoRotateTimer = useRef(null);
  
  // Ref to store current news state for gesture handling to avoid stale closures
  const newsRef = useRef(null);
  const currentIndexRef = useRef(0);
  
  // PagerView ref
  const pagerRef = useRef(null);

  useEffect(() => {
    // Load news based on route parameter or latest
    if (routeDate) {
      loadNewsForDate(routeDate);
    } else {
      loadLatestNews();
    }
    loadAvailableDates();
  }, [routeDate]);

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
  }, [news, isPaused, currentIndex, startAutoRotation]);

  // Keep refs in sync with state
  useEffect(() => {
    newsRef.current = news;
  }, [news]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Pulse animation for loading
  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          })
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
      console.error('Failed to load latest news:', err.message);
      setError('Failed to load latest news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDates = async () => {
    try {
      const dates = await fetchAvailableDates();
      setAvailableDates(dates || []);
    } catch (error) {
      console.warn('Failed to load available dates:', error.message);
      // UI will show empty dates - not critical
    }
  };

  const loadNewsForDate = async (date) => {
    try {
      setLoading(true);
      setCurrentIndex(0); // Reset to first story
      const data = await fetchNewsByDate(date);
      setNews(data);
      setCurrentDate(date);
      setError(null);
    } catch (err) {
      console.error(`Failed to load news for ${date}:`, err.message);
      setError(`Failed to load news for ${date}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const startAutoRotation = useCallback(() => {
    if (autoRotateTimer.current) {
      clearInterval(autoRotateTimer.current);
    }
    
    autoRotateTimer.current = setInterval(() => {
      if (news && news.stories && news.stories.length > 1 && pagerRef.current && !isPaused) {
        const nextIndex = (currentIndex + 1) % news.stories.length;
        pagerRef.current.setPage(nextIndex);
      }
    }, 30000); // 30 seconds - same as web
  }, [news, currentIndex, isPaused]);

  const pauseAutoRotation = () => {
    setIsPaused(true);
    if (autoRotateTimer.current) {
      clearInterval(autoRotateTimer.current);
      autoRotateTimer.current = null;
    }
  };

  const resumeAutoRotation = () => {
    setIsPaused(false);
  };

  const goToPrevious = () => {
    if (!news || !news.stories || news.stories.length <= 1 || !pagerRef.current) {
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Pause auto-rotation temporarily and resume after a delay
    pauseAutoRotation();
    setTimeout(() => {
      resumeAutoRotation();
    }, 3000); // 3 second pause after manual navigation
    
    const prevIndex = currentIndex === 0 ? news.stories.length - 1 : currentIndex - 1;
    pagerRef.current.setPage(prevIndex);
  };

  const goToNext = () => {
    if (!news || !news.stories || news.stories.length <= 1 || !pagerRef.current) {
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Pause auto-rotation temporarily and resume after a delay
    pauseAutoRotation();
    setTimeout(() => {
      resumeAutoRotation();
    }, 3000); // 3 second pause after manual navigation
    
    const nextIndex = (currentIndex + 1) % news.stories.length;
    pagerRef.current.setPage(nextIndex);
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
      console.warn('Failed to open link:', error.message);
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
        url: story.link
      });
    } catch (error) {
      console.warn('Failed to share story:', error.message);
      Alert.alert('Share Error', 'Unable to share story at this time');
    }
  };

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

  // Utility function to parse date string without timezone issues
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDisplayDate = (dateString) => {
    const date = parseDate(dateString);
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
      day === 2 || day === 22 ? 'nd' :
        day === 3 || day === 23 ? 'rd' : 'th';
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    }) + ` ${day}${suffix}, ${date.getFullYear()}`;
  };

  const handleDateSelect = (selectedDate) => {
    setShowDateSelector(false);
    if (selectedDate !== news?.date) {
      loadNewsForDate(selectedDate);
    }
  };

  const onPageSelected = (e) => {
    const newIndex = e.nativeEvent.position;
    setCurrentIndex(newIndex);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        {/* Header - compact layout with logo right, text left */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              Top 10 Optimistic, Feel-Good, Awe-Inspiring News Stories from
            </Text>
            <Text style={styles.headerDate}>
              {formatDisplayDate(currentDate || news?.date)}
            </Text>
          </View>
          
          <View style={styles.headerTitleContainer}>
            <Image 
              source={require('../../assets/everythingisawesome.jpg')} 
              style={styles.headerLogo}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={[
                styles.menuButton,
                menuButtonPressed && styles.menuButtonPressed
              ]}
              activeOpacity={0.7}
              onPressIn={() => setMenuButtonPressed(true)}
              onPressOut={() => setMenuButtonPressed(false)}
              onPress={() => {
                setShowMenu(!showMenu);
                setMenuButtonPressed(false);
              }}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            {/* Overlay to close menu when tapping outside */}
            <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
              <View style={styles.menuOverlay} />
            </TouchableWithoutFeedback>
            
            <LinearGradient
              colors={[
                themeColors[0],
                themeColors[1]
              ]}
              style={styles.menuDropdown}
            >
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  pressedMenuItem === 'howItWorks' && styles.menuItemPressed
                ]}
                activeOpacity={0.7}
                onPressIn={() => setPressedMenuItem('howItWorks')}
                onPressOut={() => setPressedMenuItem(null)}
                onPress={() => {
                  setShowMenu(false);
                  setPressedMenuItem(null);
                  navigation.navigate('HowItWorks');
                }}
              >
                <Text style={styles.menuItemText}>⚙️ How It Works</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  pressedMenuItem === 'disclaimer' && styles.menuItemPressed
                ]}
                activeOpacity={0.7}
                onPressIn={() => setPressedMenuItem('disclaimer')}
                onPressOut={() => setPressedMenuItem(null)}
                onPress={() => {
                  setShowMenu(false);
                  setPressedMenuItem(null);
                  navigation.navigate('Disclaimer');
                }}
              >
                <Text style={styles.menuItemText}>📋 Disclaimer</Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        )}

        {/* Story Content - Swiper */}
        <View style={styles.contentWrapper}>
          {/* Progress indicators with smooth animations */}
          <View style={styles.progressContainer}>
            {news.stories.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.progressDot,
                  index === currentIndex && styles.progressDotActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCurrentIndex(index);
                  if (pagerRef.current) {
                    pagerRef.current.setPage(index);
                  }
                }}
              >
                {index === currentIndex ? (
                  <LinearGradient
                    colors={['#ff6b6b', '#4ecdc4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.progressDotInner,
                      styles.progressDotActiveInner
                    ]}
                  />
                ) : (
                  <View style={styles.progressDotInner} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Swipe hint - subtle visual cue */}
          <View style={styles.swipeHintContainer}>
            <Text style={styles.swipeHintText}>← Swipe left or right →</Text>
          </View>

          <PagerView
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={onPageSelected}
            pageMargin={10}
            orientation="horizontal"
          >
            {news.stories.map((story, index) => (
              <View key={index} style={styles.page}>
                <StoryCard
                  story={story}
                  getStoryImage={getStoryImage}
                  onLinkPress={openStoryLink}
                  onSharePress={shareStory}
                />
              </View>
            ))}
          </PagerView>
        </View>

        {/* Action Buttons - Fixed at bottom */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.bottomActionButton}
            onPress={() => openStoryLink(news.stories[currentIndex]?.link)}
          >
            <Text style={styles.bottomActionButtonText}>Read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.bottomActionButton}
            onPress={() => shareStory(news.stories[currentIndex])}
          >
            <Text style={styles.bottomActionButtonText}>Share</Text>
          </TouchableOpacity>

          {availableDates.length > 1 && (
            <TouchableOpacity 
              onPress={() => setShowDateSelector(true)}
              style={styles.bottomActionButton}
            >
              <Text style={styles.bottomActionButtonText}>Dates</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation Controls - exactly like web */}
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={() => {
              goToPrevious();
            }}
            style={[styles.navButton, styles.prevButton]}
          >
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPaused ? resumeAutoRotation : pauseAutoRotation}
            style={[styles.navButton, styles.pauseButton]}
          >
            <Text style={[styles.navButtonText, isPaused ? {} : styles.pauseButtonText]}>{isPaused ? '▶' : '▐▐'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              goToNext();
            }}
            style={[styles.navButton, styles.nextButton]}
          >
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Date Selector Modal */}
        <DateSelector
          visible={showDateSelector}
          onClose={() => setShowDateSelector(false)}
          availableDates={availableDates}
          currentDate={news?.date}
          onDateSelect={handleDateSelect}
          themeColors={themeColors}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundOverlay,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  bottomActionButton: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    elevation: 8,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.shadowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12
  },
  bottomActionButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600'
  },
  container: {
    flex: 1
  },
  contentWrapper: {
    flex: 1
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundOverlay,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  headerDate: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'left',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  headerInfo: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15
  },
  headerLogo: {
    borderColor: Colors.borderSecondary,
    borderRadius: 25,
    borderWidth: 3,
    elevation: 6,
    height: 50,
    shadowColor: Colors.shadowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    width: 50
  },
  headerTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'left',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 0.15,
    justifyContent: 'center',
    position: 'relative'
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  loadingSubtext: {
    color: Colors.textTertiary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: Colors.whiteOverlayMedium,
    borderColor: Colors.borderGold,
    borderRadius: 25,
    borderWidth: 1,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10
  },
  menuButtonPressed: {
    backgroundColor: Colors.whiteOverlayStrong,
    borderColor: Colors.borderGoldStrong,
    transform: [{ translateY: -1 }]
  },
  menuButtonText: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  menuDropdown: {
    borderColor: Colors.borderStrong,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 15,
    maxWidth: 220,
    minWidth: 180,
    padding: 12,
    position: 'absolute',
    right: 15,
    shadowColor: Colors.shadowSecondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    top: 70,
    zIndex: 1000
  },
  menuItem: {
    borderColor: Colors.borderTransparent,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  menuItemPressed: {
    backgroundColor: Colors.whiteOverlayMedium,
    borderColor: Colors.borderMedium,
    transform: [{ translateX: -2 }]
  },
  menuItemText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  menuOverlay: {
    backgroundColor: Colors.backgroundOverlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    elevation: 8,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 15,
    shadowColor: Colors.shadowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: 50
  },
  navButtonText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold'
  },
  navigation: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundOverlay,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  nextButton: {},
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 2
  },
  pagerView: {
    flex: 1,
    marginHorizontal: 2
  },
  pauseButton: {
    backgroundColor: Colors.goldOverlay
  },
  pauseButtonText: {
    fontSize: 14,
    letterSpacing: 1,
    marginLeft: -5
  },
  prevButton: {},
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 12
  },
  progressDot: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundTransparent,
    borderRadius: 12,
    flex: 0,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 1,
    minWidth: 24,
    position: 'relative',
    width: 24
  },
  progressDotActive: {
    transform: [{ scale: 1.2 }]
  },
  progressDotActiveInner: {
    borderColor: Colors.borderFull,
    elevation: 8,
    shadowColor: Colors.shadowRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 25
  },
  progressDotInner: {
    backgroundColor: Colors.overlayStrong,
    borderColor: Colors.borderSecondary,
    borderRadius: 5,
    borderWidth: 1.5,
    elevation: 4,
    height: 10,
    shadowColor: Colors.primaryLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: 10
  },
  retryButton: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    elevation: 8,
    paddingHorizontal: 30,
    paddingVertical: 15,
    shadowColor: Colors.shadowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12
  },
  retryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  safeArea: {
    flex: 1
  },
  swipeHintContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 8
  },
  swipeHintText: {
    color: Colors.blackOverlay,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  }
});

export default HomeScreen;
