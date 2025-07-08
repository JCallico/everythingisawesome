import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { loadMarkdownContent, createMarkdownRenderer, disclaimerFooter, getCurrentDate } from '@everythingisawesome/shared-docs';

const DisclaimerScreen = ({ navigation }) => {
  const [content, setContent] = useState(null);

  // Create a renderer instance once using the generic renderer with native-specific options
  const renderer = useMemo(() => createMarkdownRenderer({
    platform: 'native',
    createLinkElement: (text, url, key) => {
      const handlePress = () => {
        Linking.openURL(url).catch(err => console.error('Error opening link:', err));
      };
      
      return (
        <Text key={key} style={styles.link} onPress={handlePress}>
          {text}
        </Text>
      );
    },
    createBoldElement: (text, key) => (
      <Text key={key} style={styles.boldText}>
        {text}
      </Text>
    ),
    createTextWrapper: (children, key) => (
      <Text key={key}>
        {children}
      </Text>
    ),
  }), []);
  const { renderContent, renderListItems } = renderer;

  useEffect(() => {
    try {
      const markdownContent = loadMarkdownContent('disclaimer.md');
      setContent(markdownContent);
    } catch (error) {
      console.error('Error loading disclaimer content:', error);
      setContent({
        title: 'Legal Disclaimer & Terms of Use',
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
                {disclaimerFooter.text}
              </Text>
              <Text style={styles.lastUpdated}>
                {disclaimerFooter.lastUpdatedLabel}: {getCurrentDate()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    paddingRight: 15,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#2c3e50',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  link: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  listContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2c3e50',
    marginBottom: 4,
    marginLeft: 10,
  },
  footer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DisclaimerScreen;
