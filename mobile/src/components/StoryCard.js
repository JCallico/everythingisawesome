import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const StoryCard = ({ story, getStoryImage, onLinkPress, onSharePress }) => {
  return (
    <ScrollView 
      style={styles.storyCard}
      contentContainerStyle={styles.storyCardContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Story Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getStoryImage(story) }}
          style={styles.storyImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
          style={styles.imageGradient}
        />
        
        {/* Awesome Index Badge */}
        <View style={styles.awesomeIndexContainer}>
          <View style={styles.awesomeIndexBadge}>
            <Text style={styles.awesomeScore}>{story.awesome_index}</Text>
            <Text style={styles.awesomeLabel}>awesome</Text>
          </View>
        </View>
      </View>

      {/* Story Content */}
      <BlurView intensity={15} tint="light" style={styles.contentCard}>
        <View style={styles.cardContent}>
          <View style={styles.storyContentArea}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storySummary}>
              {story.summary}
            </Text>
          </View>
        </View>
      </BlurView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Story Card styles
  storyCard: {
    flex: 1,
    width: width - 12,
  },
  storyCardContent: {
    flexGrow: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minHeight: height - 300,
  },
  imageContainer: {
    height: height * 0.4,
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
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
  awesomeIndexContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  awesomeIndexBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#ff6b6b',
    borderWidth: 0,
    shadowColor: 'rgba(255, 107, 107, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 80,
  },
  awesomeScore: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  awesomeLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.95,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    lineHeight: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentCard: {
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardContent: {
    padding: 16,
  },
  storyContentArea: {
    marginBottom: 20,
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 28,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  storySummary: {
    fontSize: 16,
    color: '#2c2c2c',
    lineHeight: 24,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default StoryCard;
