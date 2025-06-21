import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

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

const StoryScreen = ({ route, navigation }) => {
  const { story, date, index } = route.params || {};
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!story) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Story not found</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const theme = story.theme || 'hope';
  const gradientColors = themeGradients[theme] || themeGradients.hope;

  const handleReadFullStory = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const supported = await Linking.canOpenURL(story.link);
      if (supported) {
        await Linking.openURL(story.link);
      } else {
        Alert.alert('Error', 'Unable to open the link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open the article');
    }
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `Check out this awesome story: ${story.title}\n\n${story.summary}\n\nRead more: ${story.link}`,
        title: story.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getImageUrl = () => {
    if (story.image && story.image !== 'placeholder') {
      return `http://localhost:3001${story.image}`;
    }
    return `http://localhost:3001/generated-images/fallback-${theme}.png`;
  };

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }} 
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Share ↗</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Awesome Badge */}
          <View style={styles.awesomeBadge}>
            <Text style={styles.awesomeScore}>{story.awesome_index}</Text>
            <Text style={styles.awesomeLabel}>Awesome</Text>
          </View>

          {/* Story Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageUrl() }}
              style={styles.storyImage}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Loading...</Text>
              </View>
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.imageOverlay}
            />
          </View>

          {/* Story Content */}
          <View style={styles.storyContent}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storySummary}>{story.summary}</Text>

            {/* Theme Badge */}
            <View style={styles.themeBadge}>
              <Text style={styles.themeText}>#{theme}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.readMoreButton} 
                onPress={handleReadFullStory}
              >
                <Text style={styles.readMoreText}>Read Full Story</Text>
                <Text style={styles.buttonIcon}>✨</Text>
              </TouchableOpacity>
            </View>

            {/* Story Meta */}
            <View style={styles.metaContainer}>
              <Text style={styles.metaTitle}>Story Details</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date:</Text>
                <Text style={styles.metaValue}>{date}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Position:</Text>
                <Text style={styles.metaValue}>#{index + 1} of the day</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Theme:</Text>
                <Text style={styles.metaValue}>{theme}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Awesome Score:</Text>
                <Text style={styles.metaValue}>{story.awesome_index}/100</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareBtn: {
    padding: 8,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  awesomeBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  awesomeScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  awesomeLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  storyContent: {
    padding: 20,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    lineHeight: 32,
  },
  storySummary: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 20,
  },
  themeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 25,
  },
  themeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    marginBottom: 30,
  },
  readMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  readMoreText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 16,
  },
  metaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  metaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  metaValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default StoryScreen;
