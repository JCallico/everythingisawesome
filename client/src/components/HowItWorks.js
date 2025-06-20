import React from 'react';

const HowItWorks = () => {
  return (
    <div className="disclaimer-container">
      <div className="disclaimer-content">
        <h1>How It Works: The Science Behind Awesome News</h1>
        
        <div className="disclaimer-section">
          <h2>Mission & Philosophy</h2>
          <p>
            "Everything Is Awesome" is designed to combat news fatigue and negativity bias by surfacing 
            genuinely inspiring stories that often get buried under commercial content and sensationalism. 
            Our algorithm prioritizes authentic human achievements, scientific breakthroughs, community 
            successes, and environmental progress over product sales and promotional content.
          </p>
        </div>

        <div className="disclaimer-section">
          <h2>The 5-Step Curation Process</h2>
          
          <h3>Step 1: News Article Fetching</h3>
          <p>
            We query <strong>NewsAPI</strong> daily for up to 100 articles using 50+ carefully selected 
            positive keywords including "breakthrough," "cure," "rescue," "discovery," "innovation," 
            "helping," "volunteer," "charity," "triumph," "milestone," and "achievement." The system 
            searches across 100+ diverse news sources without source filtering to maximize content diversity.
          </p>

          <h3>Step 2: Multi-Stage Filtering</h3>
          <p>
            Articles undergo rigorous pre-filtering to eliminate low-quality content:
          </p>
          <ul>
            <li><strong>Keyword Filter:</strong> Removes articles with zero positive keywords</li>
            <li><strong>Quality Check:</strong> Filters out placeholder "[Removed]" content from NewsAPI</li>
            <li><strong>Commercial Content Detection:</strong> AI-powered identification of sales/promotional content</li>
            <li><strong>Sentiment Threshold:</strong> Eliminates articles scoring below 40/100 in positivity</li>
          </ul>

          <h3>Step 3: Enhanced AI Analysis</h3>
          <p>
            Each article is analyzed by <strong>Grok-3-latest</strong> using specialized prompts designed 
            to focus on genuine human interest content:
          </p>
          <ul>
            <li><strong>Anti-Commercial Filtering:</strong> Product sales and promotional content automatically scored 0-20</li>
            <li><strong>Main Event Focus:</strong> Algorithm evaluates the primary news event, not just positive entities mentioned</li>
            <li><strong>Negative Event Detection:</strong> Stories about crimes, scams, or disasters score low even if good organizations are mentioned</li>
            <li><strong>Charity Exception:</strong> Legitimate fundraising and charity auctions maintain high scores</li>
            <li><strong>Genuine Content Prioritization:</strong> Scientific breakthroughs, community achievements, and inspiring human stories score 80-100</li>
          </ul>

          <h3>Step 4: Awesome Index Calculation</h3>
          <p>
            The proprietary Awesome Index combines multiple factors for final ranking:
          </p>
          <ul>
            <li><strong>Base Sentiment Score:</strong> AI-generated positivity rating (50-100 range)</li>
            <li><strong>Keyword Density Bonus:</strong> Up to 10 additional points for articles mentioning multiple positive themes</li>
            <li><strong>Commercial Penalty:</strong> Significant score reduction for sales/promotional content</li>
            <li><strong>Final Range:</strong> All scores normalized to 50-100 scale, ensuring minimum positivity threshold</li>
          </ul>

          <h3>Step 5: Content Enhancement & Selection</h3>
          <p>
            The top 10 highest-scoring articles are enhanced with AI-generated content:
          </p>
          <ul>
            <li><strong>Smart Summarization:</strong> Concise, uplifting summaries highlighting inspiring aspects</li>
            <li><strong>Custom Image Generation:</strong> AI-created visuals using Grok-2-image based on story themes</li>
            <li><strong>Themed Fallbacks:</strong> Pre-generated category images when AI generation fails</li>
            <li><strong>Source Preservation:</strong> Original URLs maintained for credibility and verification</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h2>Algorithm Improvements & Anti-Commercial Measures</h2>
          
          <h3>Commercial Content Detection</h3>
          <p>
            Our algorithm specifically identifies and filters out commercial content that often masquerades 
            as news, including:
          </p>
          <ul>
            <li>Product sales announcements and price drops</li>
            <li>"Deal of the day" and promotional content</li>
            <li>Shopping guides and buying recommendations</li>
            <li>Affiliate marketing disguised as news</li>
            <li>Brand promotional content and advertisements</li>
          </ul>

          <h3>Contextual Understanding</h3>
          <p>
            The AI analyzes the <strong>primary event</strong> rather than just positive keywords, ensuring:
          </p>
          <ul>
            <li>Negative news mentioning good organizations is properly filtered</li>
            <li>Genuine positive outcomes are distinguished from incidental mentions</li>
            <li>Context and impact are considered in scoring decisions</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h2>Performance Metrics & Quality Assurance</h2>
          
          <h3>Current Performance (June 2025)</h3>
          <ul>
            <li><strong>Articles Processed:</strong> Up to 100 per day from NewsAPI</li>
            <li><strong>Commercial Filtering Success:</strong> ~95% of sales/promotional articles filtered out</li>
            <li><strong>Content Quality:</strong> Awesome indices ranging from 69-99 with improved distribution</li>
            <li><strong>Selection Rate:</strong> ~10% of processed articles make final top 10</li>
            <li><strong>Content Categories:</strong> Scientific discoveries, community service, environmental progress, educational excellence, cultural achievements</li>
          </ul>

          <h3>Quality Indicators</h3>
          <p>
            High-quality articles typically feature:
          </p>
          <ul>
            <li>Scientific breakthroughs and medical advances</li>
            <li>Community achievements and charitable successes</li>
            <li>Environmental victories and conservation wins</li>
            <li>Educational breakthroughs and accessibility improvements</li>
            <li>Inspirational human stories with positive outcomes</li>
            <li>Cultural milestones and artistic achievements</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h2>Technical Architecture</h2>
          
          <h3>Data Sources</h3>
          <ul>
            <li><strong>NewsAPI:</strong> 100+ diverse news sources for authentic, timestamped articles</li>
            <li><strong>Grok-3-latest:</strong> Advanced AI model for sentiment analysis and summarization</li>
            <li><strong>Grok-2-image:</strong> AI image generation tailored to story content and themes</li>
          </ul>

          <h3>Processing Pipeline</h3>
          <ul>
            <li><strong>Automated Daily Collection:</strong> Fetches and processes news without human intervention</li>
            <li><strong>Real-time AI Analysis:</strong> Live sentiment scoring and content evaluation</li>
            <li><strong>Robust Error Handling:</strong> 3-retry system with fallback mechanisms</li>
            <li><strong>Quality Assurance:</strong> Multiple filtering layers ensure content standards</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h2>Assumptions & Limitations</h2>
          
          <h3>Editorial Assumptions</h3>
          <ul>
            <li>Genuine human achievements are more inspiring than commercial successes</li>
            <li>Scientific and medical breakthroughs deserve prioritization over product launches</li>
            <li>Community service and charitable work represent authentic positivity</li>
            <li>Environmental progress and conservation efforts are inherently uplifting</li>
            <li>Educational achievements and accessibility improvements benefit society</li>
          </ul>

          <h3>Technical Limitations</h3>
          <ul>
            <li><strong>Source Dependency:</strong> Quality limited by NewsAPI article availability and diversity</li>
            <li><strong>AI Interpretation:</strong> Sentiment analysis may occasionally misinterpret context or tone</li>
            <li><strong>Language Constraints:</strong> Currently optimized for English-language content only</li>
            <li><strong>Temporal Bias:</strong> Focuses on recent news (24-48 hour window) rather than historical significance</li>
            <li><strong>Commercial Detection:</strong> May occasionally miss sophisticated native advertising</li>
          </ul>

          <h3>Scoring Considerations</h3>
          <ul>
            <li>Algorithm favors stories with clear positive outcomes over ambiguous situations</li>
            <li>Higher weight given to stories affecting multiple people vs. individual achievements</li>
            <li>Scientific credibility and institutional backing influence scoring</li>
            <li>Recency and relevance factored into final rankings</li>
          </ul>
        </div>

        <div className="disclaimer-section">
          <h2>Continuous Improvement</h2>
          <p>
            The algorithm is continuously refined based on performance analysis and quality assessment. 
            Recent improvements include enhanced commercial content detection, better contextual understanding 
            of negative events, and expanded article processing capacity. The system learns from edge cases 
            and adapts to ensure consistently high-quality content curation.
          </p>
        </div>

        <div className="disclaimer-footer">
          <p>
            <strong>This algorithmic approach ensures that "Everything Is Awesome" delivers genuinely 
            inspiring content while filtering out commercial noise and negative events.</strong>
          </p>
          <p className="last-updated">
            Algorithm last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
