# Theme Update Script

This script applies the unified theme detection logic to all existing data files in the project, adding the `theme` property to stories that don't already have one.

## What it does

1. **Scans** all JSON files in the `data/` directory
2. **Reads** each file and processes all stories within it
3. **Detects** themes using the unified keyword system from `fetchNews.js`
4. **Adds** the `theme` property to stories that don't already have one
5. **Preserves** existing themes (won't overwrite if already present)
6. **Saves** the updated files back to disk

## Usage

### Run via npm script (recommended):
```bash
npm run update-themes
```

### Run directly:
```bash
node server/scripts/updateThemes.js
```

### Run with executable permissions:
```bash
./server/scripts/updateThemes.js
```

## Theme Detection Logic

The script uses the same unified theme system as the news fetching process, with 17 different themes:

- `health` - Medical, health, treatment-related stories
- `nature` - Environment, climate, sustainability stories
- `innovation` - Technology, AI, breakthrough stories
- `community` - Volunteer, charity, social support stories
- `education` - Learning, school, academic stories
- `sports` - Athletic, competition, fitness stories
- `science` - Research, discovery, scientific stories
- `arts` - Culture, music, creative stories
- `business` - Finance, market, economic stories
- `entertainment` - Celebrity, movie, show stories
- `travel` - Tourism, adventure, journey stories
- `food` - Restaurant, cooking, cuisine stories
- `lifestyle` - Wellness, fashion, personal stories
- `politics` - Government, election, policy stories
- `economy` - Economic indicators, financial news
- `world` - International, global news
- `inspiring` - Uplifting, positive, triumphant stories
- `hope` - Default fallback theme

## Output

The script provides detailed logging:
- Shows which file is being processed
- Lists each story being updated with its detected theme
- Reports skipped stories (those that already have themes)
- Provides a summary of successes and errors

## Safety

- **Non-destructive**: Only adds themes to stories that don't have them
- **Backup recommended**: Consider backing up your data files before running
- **Error handling**: Continues processing other files if one fails
- **Validation**: Checks for valid story structures before processing

## Example Output

```
🚀 Theme Update Script
======================

🎨 Starting theme update for all existing data files...

📊 Found 5 data files to process:

Processing: 2025-06-01.json
  Story 1: "Scientists discover breakthrough cure for common..." → health
  Story 2: "Community volunteers plant 1000 trees in local..." → nature
  ✅ Updated 10 stories, skipped 0 (already had themes)

Processing: 2025-06-02.json
  Story 1: "Local charity raises record funds for homeless..." → community
  ✅ Updated 8 stories, skipped 2 (already had themes)

📋 Update Summary:
   ✅ Successfully updated: 5 files
   ❌ Errors encountered: 0 files
   📁 Total files processed: 5

🎉 All themes updated successfully!
```

## Integration

After running this script:
1. All existing stories will have theme properties
2. The NewsDisplay component will use pre-calculated themes
3. Future news fetching will continue to add themes automatically
4. Improved performance as themes don't need to be calculated dynamically
