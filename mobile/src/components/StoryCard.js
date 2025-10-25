import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const StoryCard = ({ story, getStoryImage, _onLinkPress, _onSharePress }) => {
  const [expandedOpinion, setExpandedOpinion] = useState(false);
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

            {/* Opinion Section - Collapsible */}
            {story.opinion && (
              <View style={styles.opinionSection}>
                <TouchableOpacity
                  style={styles.opinionToggle}
                  onPress={() => setExpandedOpinion(!expandedOpinion)}
                >
                  <Text style={styles.opinionToggleIcon}>
                    {expandedOpinion ? '▼' : '▶'}
                  </Text>
                  <Text style={styles.opinionSubtitle}>Grok's Take</Text>
                </TouchableOpacity>
                {expandedOpinion && (
                  <Text style={styles.storyOpinion}>
                    {story.opinion}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  awesomeIndexBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 25,
    borderWidth: 0,
    elevation: 8,
    minWidth: 80,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: Colors.shadowAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12
  },
  awesomeIndexContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10
  },
  awesomeLabel: {
    color: Colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 14,
    opacity: 0.95,
    textAlign: 'center',
    textShadowColor: Colors.textShadowDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: 'capitalize'
  },
  awesomeScore: {
    color: Colors.textOnPrimary,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
    textShadowColor: Colors.textShadowDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  cardContent: {
    padding: 16
  },
  contentCard: {
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 8,
    overflow: 'hidden'
  },
  imageContainer: {
    borderRadius: 20,
    height: height * 0.4,
    marginBottom: 20,
    marginHorizontal: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  imageGradient: {
    bottom: 0,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0
  },
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
    shadowColor: Colors.shadowSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  storyContentArea: {
    marginBottom: 20
  },
  storyImage: {
    height: '100%',
    width: '100%'
  },
  storySummary: {
    color: Colors.textTertiary,
    fontSize: 16,
    lineHeight: 24,
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  storyTitle: {
    color: Colors.textSecondary,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: 12,
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  opinionSection: {
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    borderLeftColor: Colors.accent,
    borderLeftWidth: 4,
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  opinionToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  opinionToggleIcon: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '600'
  },
  opinionSubtitle: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  storyOpinion: {
    color: Colors.textTertiary,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: 8,
    paddingLeft: 12,
    textShadowColor: Colors.textShadowLight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  }
});

export default StoryCard;
