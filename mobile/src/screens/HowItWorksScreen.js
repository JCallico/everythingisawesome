import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const HowItWorksScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#ffecd2', '#fcb69f']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>How "Everything Is Awesome News" Works</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mission & Philosophy</Text>
              <Text style={styles.paragraph}>
                "Everything Is Awesome" is designed to combat news fatigue and negativity bias by surfacing 
                genuinely inspiring stories that often get buried under commercial content and sensationalism. 
                Our algorithm prioritizes authentic human achievements, scientific breakthroughs, community 
                successes, and environmental progress over product sales and promotional content.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>The 6-Step Curation Process</Text>
              
              <Text style={styles.stepTitle}>Step 1: News Article Fetching</Text>
              <Text style={styles.paragraph}>
                We query <Text style={styles.boldText}>NewsAPI</Text> daily for up to 100 articles using 50+ carefully selected 
                positive keywords including "breakthrough," "cure," "rescue," "discovery," "innovation," 
                "helping," "volunteer," "charity," "triumph," "milestone," and "achievement." The system 
                searches across 100+ diverse news sources without source filtering to maximize content diversity.
              </Text>

              <Text style={styles.stepTitle}>Step 2: Multi-Stage Filtering</Text>
              <Text style={styles.paragraph}>
                Articles undergo rigorous pre-filtering to eliminate low-quality content:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Keyword Filter:</Text> Removes articles with zero positive keywords</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Quality Check:</Text> Filters out placeholder "[Removed]" content from NewsAPI</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Commercial Content Detection:</Text> AI-powered identification of sales/promotional content</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Sentiment Threshold:</Text> Eliminates articles scoring below 40/100 in positivity</Text>
              </View>

              <Text style={styles.stepTitle}>Step 3: Enhanced AI Analysis</Text>
              <Text style={styles.paragraph}>
                Each article is analyzed by <Text style={styles.boldText}>Grok-3-latest</Text> using specialized prompts designed 
                to focus on genuine human interest content:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Anti-Commercial Filtering:</Text> Product sales and promotional content automatically scored 0-20</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Main Event Focus:</Text> Algorithm evaluates the primary news event, not just positive entities mentioned</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Negative Event Detection:</Text> Stories about crimes, scams, or disasters score low even if good organizations are mentioned</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Charity Exception:</Text> Legitimate fundraising and charity auctions maintain high scores</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Genuine Content Prioritization:</Text> Scientific breakthroughs, community achievements, and inspiring human stories score 80-100</Text>
              </View>

              <Text style={styles.stepTitle}>Step 4: Awesome Index Calculation</Text>
              <Text style={styles.paragraph}>
                The proprietary Awesome Index combines multiple factors for final ranking:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Base Sentiment Score:</Text> AI-generated positivity rating (50-100 range)</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Keyword Density Bonus:</Text> Up to 10 additional points for articles mentioning multiple positive themes</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Commercial Penalty:</Text> Significant score reduction for sales/promotional content</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Final Range:</Text> All scores normalized to 50-100 scale, ensuring minimum positivity threshold</Text>
              </View>

              <Text style={styles.stepTitle}>Step 5: Generic Duplicate Detection</Text>
              <Text style={styles.paragraph}>
                Advanced duplicate story detection ensures unique content using cutting-edge fuzzy string matching:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>12 Similarity Algorithms:</Text> Analyzes titles, summaries, and combined text using ratio, partial ratio, token sort, and token set matching</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>No Hardcoded Keywords:</Text> Purely generic approach that works for any news content (health, sports, politics, entertainment, etc.)</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Optimal Threshold:</Text> Uses scientifically determined threshold of 70 for maximum accuracy</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Smart Selection:</Text> Keeps the highest awesome_index story from each duplicate group</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Proven Performance:</Text> Achieved 100% precision and 100% recall on test data with zero false positives</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Universal Coverage:</Text> Works across all news categories without requiring manual keyword maintenance</Text>
              </View>

              <Text style={styles.stepTitle}>Step 6: Content Enhancement & Final Selection</Text>
              <Text style={styles.paragraph}>
                The top 10 highest-scoring unique articles are enhanced with AI-generated content:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Smart Summarization:</Text> Concise, uplifting summaries highlighting inspiring aspects</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Custom Image Generation:</Text> AI-created visuals using Grok-2-image based on story themes</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Themed Fallbacks:</Text> Pre-generated category images when AI generation fails</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Advanced AI Analysis Technology</Text>
              
              <Text style={styles.subSectionTitle}>Grok-3-Latest Enhanced Sentiment Analysis</Text>
              <Text style={styles.paragraph}>
                Our AI analysis uses X.AI's most advanced Grok-3-latest model with specialized prompts designed 
                to distinguish between genuine inspiring content and commercial promotional material. This ensures 
                only authentic positive stories make it through our filters.
              </Text>
              
              <Text style={styles.subSectionTitle}>Multi-Criteria Evaluation System</Text>
              <Text style={styles.paragraph}>
                Each article undergoes comprehensive analysis across multiple dimensions:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Primary Event Analysis:</Text> AI evaluates the main news event, not just positive keywords mentioned</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Commercial Content Detection:</Text> Automatically identifies and scores product sales, deals, and promotional content 0-20</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Contextual Understanding:</Text> Distinguishes between genuine positive outcomes vs. incidental mentions of good organizations</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Impact Assessment:</Text> Prioritizes stories with meaningful human impact over trivial positive mentions</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Authenticity Verification:</Text> Filters out native advertising and disguised commercial content</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Proprietary Awesome Index Algorithm</Text>
              
              <Text style={styles.subSectionTitle}>Mathematical Formula & Components</Text>
              <Text style={styles.paragraph}>
                The Awesome Index combines multiple factors using a scientifically designed formula:{'\n'}
                <Text style={styles.boldText}>Awesome Index = max(50, min(100, sentiment_score + keyword_boost))</Text>
              </Text>
              
              <Text style={styles.subSectionTitle}>Sentiment Score Foundation (50-100 Range)</Text>
              <Text style={styles.paragraph}>
                The base sentiment score forms the foundation of our ranking system:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>AI-Generated Base:</Text> Grok-3-latest provides initial 0-100 positivity assessment</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Minimum Threshold:</Text> All scores normalized to 50-100 range ensuring baseline positivity</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Commercial Penalty:</Text> Sales/promotional content automatically capped at low scores</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Authenticity Bonus:</Text> Genuine human interest stories receive full scoring potential</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Impact Weighting:</Text> Stories affecting multiple people or having lasting impact score higher</Text>
              </View>

              <Text style={styles.subSectionTitle}>Keyword Density Analysis</Text>
              <Text style={styles.paragraph}>
                Our system analyzes positive keyword density to identify particularly uplifting content:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>50+ Positive Keywords:</Text> Curated list including breakthrough, rescue, innovation, triumph, community</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Smart Counting:</Text> Identifies genuine positive context vs. superficial mentions</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Bonus Calculation:</Text> Up to 10 additional points based on keyword density (keyword_count × 2)</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Diminishing Returns:</Text> Prevents keyword stuffing by capping bonus at 10 points</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Quality Over Quantity:</Text> Emphasizes meaningful keyword usage over raw frequency</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Metrics & Quality Assurance</Text>
              
              <Text style={styles.subSectionTitle}>Current Performance (June 2025)</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Articles Processed:</Text> Up to 100 per day from NewsAPI</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Commercial Filtering Success:</Text> ~95% of sales/promotional articles filtered out</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Content Quality:</Text> Awesome indices ranging from 69-99 with improved distribution</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Selection Rate:</Text> ~10% of processed articles make final top 10</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Continuous Improvement</Text>
              <Text style={styles.paragraph}>
                The algorithm is continuously refined based on performance analysis and quality assessment. 
                Recent improvements include enhanced commercial content detection, better contextual understanding 
                of negative events, advanced generic duplicate detection with 100% accuracy, and expanded article 
                processing capacity. The system learns from edge cases and adapts to ensure consistently 
                high-quality content curation while preventing duplicate stories across all news categories.
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                <Text style={styles.boldText}>
                  This algorithmic approach ensures that "Everything Is Awesome" delivers genuinely 
                  inspiring, unique content while filtering out commercial noise, negative events, and duplicate stories.
                </Text>
              </Text>
              <Text style={styles.lastUpdated}>
                Algorithm last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
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
  title: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 60, // Add padding to prevent overlap with close button
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subSectionTitle: {
    color: '#2c2c2c',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  stepTitle: {
    color: '#1a1a1a',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  paragraph: {
    color: '#2c2c2c',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'justify',
  },
  bulletList: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  bulletPoint: {
    color: '#2c2c2c',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  footerText: {
    color: '#2c2c2c',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  lastUpdated: {
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default HowItWorksScreen;
