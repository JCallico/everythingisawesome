import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions
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
    width: width - 12
  },
  storyCardContent: {
    borderRadius: 20,
    elevation: 4,
    flexGrow: 1,
    minHeight: height - 300,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  imageContainer: {
    borderRadius: 20,
    height: height * 0.4,
    marginBottom: 20,
    marginHorizontal: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  storyImage: {
    height: '100%',
    width: '100%'
  },
  imageGradient: {
    bottom: 0,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0
  },
  awesomeIndexContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10
  },
  awesomeIndexBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    borderWidth: 0,
    elevation: 8,
    minWidth: 80,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: 'rgba(255, 107, 107, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12
  },
  awesomeScore: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  awesomeLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 14,
    opacity: 0.95,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: 'capitalize'
  },
  contentCard: {
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 8,
    overflow: 'hidden'
  },
  cardContent: {
    padding: 16
  },
  storyContentArea: {
    marginBottom: 20
  },
  storyTitle: {
    color: '#1a1a1a',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  storySummary: {
    color: '#2c2c2c',
    fontSize: 16,
    lineHeight: 24,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  }
});

export default StoryCard;
