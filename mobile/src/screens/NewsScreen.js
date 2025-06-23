import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import axios from 'axios';

const { width } = Dimensions.get('window');

// API configuration
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:3001/api';
  }
  return 'https://everythingisawesome-e0e3cycwcwezceem.canadaeast-01.azurewebsites.net/api';
};

// Utility functions
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

const getDaysAgo = (dateString) => {
  const today = new Date();
  const date = parseDate(dateString);
  const diffTime = today - date;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  return `${Math.ceil(diffDays / 7)} weeks ago`;
};

// Theme configurations for gradient backgrounds
const themeGradients = {
  hope: ['#FFD700', '#FFA500', '#FF6347'],
  health: ['#32CD32', '#20B2AA', '#4169E1'],
  innovation: ['#8A2BE2', '#4169E1', '#00CED1'],
  education: ['#FF6347', '#FFD700', '#32CD32'],
  community: ['#FF69B4', '#DA70D6', '#BA55D3'],
  science: ['#00CED1', '#20B2AA', '#32CD32'],
  arts: ['#DDA0DD', '#DA70D6', '#FF69B4'],
  entertainment: ['#FFD700', '#FFA500', '#FF4500'],
  business: ['#4169E1', '#6495ED', '#87CEEB'],
  sports: ['#32CD32', '#FFD700', '#FF6347'],
  travel: ['#87CEEB', '#20B2AA', '#32CD32'],
  food: ['#FFA500', '#FFD700', '#FF6347'],
  lifestyle: ['#DA70D6', '#DDA0DD', '#E6E6FA'],
  nature: ['#32CD32', '#228B22', '#006400'],
  politics: ['#4169E1', '#6495ED', '#87CEEB'],
  economy: ['#FFD700', '#FFA500', '#FF6347'],
  world: ['#20B2AA', '#4169E1', '#8A2BE2'],
  inspiring: ['#FFD700', '#FF69B4', '#32CD32'],
};

const NewsScreen = ({ route, navigation }) => {
  const { date } = route.params || {};
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  
  // Loading animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (date) {
      loadNewsForDate(date);
    } else {
      loadLatestNews();
    }
  }, [date]);

  // Pulse animation for loading
  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
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
    } else {
      // Fade in animation when content loads
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, pulseAnim, fadeAnim]);

  const loadNewsForDate = async (newsDate) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${getApiBaseUrl()}/news/date/${newsDate}`, {
        timeout: 10000,
      });
      setNews(response.data);
      setCurrentStoryIndex(0);
    } catch (err) {
      console.error('Error loading news for date:', err);
      setError(`Failed to load news for ${formatDisplayDate(newsDate)}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${getApiBaseUrl()}/news/latest`, {
        timeout: 10000,
      });
      setNews(response.data);
      setCurrentStoryIndex(0);
    } catch (err) {
      console.error('Error loading latest news:', err);
      setError('Failed to load latest news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToStory = (story, index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Story', {
      story,
      date: news.date,
      index,
    });
  };

  const handleRetry = () => {
    if (date) {
      loadNewsForDate(date);
    } else {
      loadLatestNews();
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <ActivityIndicator size="large" color="#fff" />
            </Animated.View>
            <Text style={styles.loadingText}>Loading awesome news...</Text>
            <Text style={styles.loadingSubtext}>
              {date ? `For ${formatDisplayDate(date)}` : 'Latest stories'}
            </Text>
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.errorTitle}>😔 Oops!</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again 🔄</Text>
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.errorTitle}>📰 No Stories Found</Text>
            <Text style={styles.errorText}>
              No awesome news available for this date. Try a different day!
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.retryButtonText}>← Choose Different Date</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentStory = news.stories[currentStoryIndex];
  const theme = currentStory?.theme || 'hope';
  const gradientColors = themeGradients[theme] || themeGradients.hope;

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{formatDisplayDate(news.date)}</Text>
              <Text style={styles.headerSubtitle}>{getDaysAgo(news.date)}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Bar */}
            <BlurView intensity={20} style={styles.statsBar}>
              <View style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{news.stories.length}</Text>
                  <Text style={styles.statLabel}>Stories</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentStoryIndex + 1}</Text>
                  <Text style={styles.statLabel}>Current</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {Math.round(news.stories.reduce((sum, story) => sum + (story.awesome_index || 0), 0) / news.stories.length)}
                  </Text>
                  <Text style={styles.statLabel}>Avg Awesome</Text>
                </View>
              </View>
            </BlurView>

            {/* Current Story */}
            {currentStory && (
              <BlurView intensity={20} style={styles.storyCard}>
                <View style={styles.storyHeader}>
                  <View style={styles.awesomeBadge}>
                    <Text style={styles.awesomeScore}>{currentStory.awesome_index || 0}</Text>
                    <Text style={styles.awesomeLabel}>Awesome</Text>
                  </View>
                  <View style={styles.themeBadge}>
                    <Text style={styles.themeText}>#{theme}</Text>
                  </View>
                </View>

                <View style={styles.storyContent}>
                  <Text style={styles.storyTitle}>{currentStory.title}</Text>
                  <Text style={styles.storySummary}>{currentStory.summary}</Text>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => navigateToStory(currentStory, currentStoryIndex)}
                    >
                      <Text style={styles.actionButtonText}>👁️ View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            )}

            {/* Story Navigation */}
            <View style={styles.storyNavigation}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentStoryIndex === 0 && styles.navButtonDisabled
                ]}
                onPress={() => {
                  if (currentStoryIndex > 0) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCurrentStoryIndex(currentStoryIndex - 1);
                  }
                }}
                disabled={currentStoryIndex === 0}
              >
                <Text style={[
                  styles.navButtonText,
                  currentStoryIndex === 0 && styles.navButtonTextDisabled
                ]}>
                  ← Previous
                </Text>
              </TouchableOpacity>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${((currentStoryIndex + 1) / news.stories.length) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {currentStoryIndex + 1} of {news.stories.length}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentStoryIndex === news.stories.length - 1 && styles.navButtonDisabled
                ]}
                onPress={() => {
                  if (currentStoryIndex < news.stories.length - 1) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCurrentStoryIndex(currentStoryIndex + 1);
                  }
                }}
                disabled={currentStoryIndex === news.stories.length - 1}
              >
                <Text style={[
                  styles.navButtonText,
                  currentStoryIndex === news.stories.length - 1 && styles.navButtonTextDisabled
                ]}>
                  Next →
                </Text>
              </TouchableOpacity>
            </View>

            {/* All Stories Preview */}
            <BlurView intensity={20} style={styles.allStoriesCard}>
              <Text style={styles.allStoriesTitle}>All Stories for This Day</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesPreview}>
                {news.stories.map((story, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.storyPreviewItem,
                      index === currentStoryIndex && styles.storyPreviewItemActive
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCurrentStoryIndex(index);
                    }}
                  >
                    <View style={styles.storyPreviewBadge}>
                      <Text style={styles.storyPreviewAwesome}>{story.awesome_index || 0}</Text>
                    </View>
                    <Text style={styles.storyPreviewTitle} numberOfLines={2}>
                      {story.title}
                    </Text>
                    <Text style={styles.storyPreviewTheme}>#{story.theme || 'hope'}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </BlurView>
          </ScrollView>
        </Animated.View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  headerSpacer: {
    width: 60,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  backBtnText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
    opacity: 0.9,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  retryButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  statsBar: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  statsContent: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 15,
  },
  storyCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  awesomeBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  awesomeScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  awesomeLabel: {
    fontSize: 10,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '600',
  },
  themeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  themeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  storyContent: {
    padding: 20,
    paddingTop: 15,
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    lineHeight: 28,
  },
  storySummary: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 20,
  },
  actionButtons: {
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  storyNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.5,
  },
  navButtonText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    opacity: 0.6,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  allStoriesCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  allStoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
    paddingBottom: 15,
  },
  storiesPreview: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  storyPreviewItem: {
    width: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  storyPreviewItemActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  storyPreviewBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  storyPreviewAwesome: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  storyPreviewTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 6,
  },
  storyPreviewTheme: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.7,
  },
});

export default NewsScreen;
