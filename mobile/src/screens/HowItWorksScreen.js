import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { loadMarkdownContent, createMarkdownRenderer, howItWorksFooter, getCurrentDate } from '@everythingisawesome/shared-docs';

const HowItWorksScreen = ({ navigation }) => {
  const [content, setContent] = useState(null);

  // Create a renderer instance once using the generic renderer with native-specific options
  const renderer = useMemo(() => createMarkdownRenderer({
    platform: 'native',
    createLinkElement: (text, url, key) => (
      <Text key={key} style={styles.link}>
        {text}
      </Text>
    ),
    createBoldElement: (text, key) => (
      <Text key={key} style={styles.boldText}>
        {text}
      </Text>
    ),
    createTextWrapper: (children, key) => (
      <Text key={key}>
        {children}
      </Text>
    )
  }), []);
  const { renderContent, renderListItems } = renderer;

  useEffect(() => {
    try {
      const markdownContent = loadMarkdownContent('how-it-works.md');
      setContent(markdownContent);
    } catch (error) {
      console.warn('Failed to load how-it-works.md:', error.message);
      setContent({
        title: 'How "Everything Is Awesome News" Works',
        sections: [{
          title: 'Error',
          content: 'Unable to load content at this time.'
        }]
      });
    }
  }, []);

  if (!content) {
    return (
      <LinearGradient
        colors={['#ffecd2', '#fcb69f']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Loading...</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
              activeOpacity={0.7}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#ffecd2', '#fcb69f']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>{content.title}</Text>
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
            
            {content.sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                
                {section.subsections && section.subsections.length > 0 ? (
                  section.subsections.map((subsection, subIndex) => (
                    <View key={subIndex}>
                      <Text style={styles.stepTitle}>{subsection.title}</Text>
                      {subsection.content && (
                        <Text style={styles.paragraph}>{renderContent(subsection.content)}</Text>
                      )}
                      {subsection.listItems && subsection.listItems.length > 0 && 
                        renderListItems(subsection.listItems, renderedItems => (
                          <View style={styles.listContainer}>
                            {renderedItems.map((item, idx) => (
                              <Text key={idx} style={styles.listItem}>• {item}</Text>
                            ))}
                          </View>
                        ))
                      }
                    </View>
                  ))
                ) : (
                  <>
                    {section.content && (
                      <Text style={styles.paragraph}>{renderContent(section.content)}</Text>
                    )}
                    {section.listItems && section.listItems.length > 0 && 
                      renderListItems(section.listItems, renderedItems => (
                        <View style={styles.listContainer}>
                          {renderedItems.map((item, idx) => (
                            <Text key={idx} style={styles.listItem}>• {item}</Text>
                          ))}
                        </View>
                      ))
                    }
                  </>
                )}
              </View>
            ))}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {howItWorksFooter.text}
              </Text>
              <Text style={styles.lastUpdated}>
                {howItWorksFooter.lastUpdatedLabel}: {getCurrentDate()}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold'
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  closeButtonText: {
    color: Colors.slate,
    fontSize: 18,
    fontWeight: 'bold'
  },
  container: {
    flex: 1
  },
  content: {
    paddingBottom: 30,
    paddingHorizontal: 20
  },
  footer: {
    backgroundColor: Colors.backgroundTransparent,
    borderRadius: 12,
    marginTop: 10,
    padding: 20
  },
  footerText: {
    color: Colors.slate,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 10
  },
  lastUpdated: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  link: {
    color: Colors.textLink,
    textDecorationLine: 'underline'
  },
  listContainer: {
    marginBottom: 8,
    marginTop: 8
  },
  listItem: {
    color: Colors.slate,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 10
  },
  paragraph: {
    color: Colors.slate,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8
  },
  safeArea: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  section: {
    backgroundColor: Colors.backgroundTransparent,
    borderRadius: 12,
    marginBottom: 25,
    padding: 20
  },
  sectionTitle: {
    color: Colors.slate,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  stepTitle: {
    color: Colors.textSubtle,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12
  },
  title: {
    color: Colors.slate,
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    paddingRight: 15
  }
});

export default HowItWorksScreen;
