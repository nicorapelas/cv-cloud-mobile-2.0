#!/bin/bash

# Script to prepare Google Play Store assets
# Run from: /home/nicorapelas/Workspace/cv-cloud/rebuild/mobile

set -e

echo "🎨 Preparing Google Play Store Assets..."
echo ""

# Create store-assets directory
mkdir -p store-assets/playstore

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Installing..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

echo "✅ ImageMagick is installed"
echo ""

# 1. Create 512x512 app icon for Play Store
echo "📱 Creating 512x512 app icon..."
convert assets/icon.png -resize 512x512 store-assets/playstore/icon-512.png
echo "✅ Created: store-assets/playstore/icon-512.png"
echo ""

# 2. Create feature graphic template (1024x500)
echo "🎨 Creating feature graphic template (1024x500)..."

# Create a simple feature graphic with gradient background
convert -size 1024x500 \
  gradient:'#3498db-#232936' \
  -gravity center \
  -font Liberation-Sans-Bold -pointsize 80 -fill white \
  -annotate +0-50 'CV Cloud' \
  -font Liberation-Sans -pointsize 32 -fill '#ecf0f1' \
  -annotate +0+50 'Professional CV Builder' \
  store-assets/playstore/feature-graphic.png

echo "✅ Created: store-assets/playstore/feature-graphic.png"
echo "   ⚠️  This is a basic template. Consider enhancing it with design software."
echo ""

# 3. Copy adaptive icon for reference
echo "📋 Copying adaptive icon..."
cp assets/adaptive-icon.png store-assets/playstore/adaptive-icon-1024.png
echo "✅ Created: store-assets/playstore/adaptive-icon-1024.png"
echo ""

# 4. Create instructions file
cat > store-assets/playstore/README.md << 'EOF'
# Google Play Store Assets

## ✅ Ready to Upload

1. **icon-512.png** (512x512)
   - High-res app icon for Play Store listing
   - Upload to: Store listing → App icon

2. **adaptive-icon-1024.png** (1024x1024)
   - Adaptive icon for Android devices
   - Upload to: Store listing → App icon (if requested)

3. **feature-graphic.png** (1024x500)
   - Feature graphic for Play Store
   - Upload to: Store listing → Feature graphic
   - ⚠️ This is auto-generated. Consider improving with:
     - Canva: https://www.canva.com/
     - Figma: https://www.figma.com/
     - Add app screenshots or mockups
     - Add your logo
     - Make it visually appealing

## 📱 Screenshots Needed

You need 2-8 phone screenshots. To create them:

### Method 1: From Running App (Recommended)
1. Run your app:
   ```bash
   npx expo start
   ```
2. Open on your phone via Expo Go or development build
3. Navigate through key screens
4. Take screenshots (Power + Volume Down on Android)
5. Transfer to: `store-assets/playstore/screenshots/`

### Method 2: From Emulator
1. Run Android emulator
2. Take screenshots using emulator controls
3. Save to: `store-assets/playstore/screenshots/`

### Recommended Screenshots:
1. **Welcome/Login screen** - First impression
2. **Dashboard** - Main app interface
3. **CV Templates** - Show variety of templates
4. **Editing CV** - Show ease of use
5. **CV Preview** - Show final result
6. **Profile/Settings** - Show features
7. **Share CV** - Show functionality
8. **Video Introduction** - Unique feature

### Screenshot Requirements:
- Format: PNG or JPEG
- Min dimensions: 320px
- Max dimensions: 3840px
- Aspect ratio: Between 16:9 and 9:16

## 🎨 Tips for Great Screenshots

1. **Clean UI:** Remove test data, use realistic examples
2. **Highlight Features:** Add text overlays explaining features
3. **Professional:** Use consistent styling
4. **Show Value:** Demonstrate what users can accomplish

Tools for adding text to screenshots:
- **Figma:** https://www.figma.com/ (Free, professional)
- **Canva:** https://www.canva.com/ (Easy, templates available)
- **GIMP:** Free image editor
- **Mockup generators:** https://mockuphone.com/

## 📋 Upload Checklist

Before uploading to Play Console:

- [ ] Icon 512x512 ready
- [ ] Feature graphic 1024x500 ready (and looks good!)
- [ ] At least 2 screenshots ready
- [ ] Screenshots show key app features
- [ ] All images are high quality
- [ ] No copyrighted content in images
- [ ] Images match actual app appearance

## 🚀 Next Steps

1. Create screenshots (see methods above)
2. Enhance feature graphic if needed
3. Upload all assets to Play Console
4. Complete store listing text
5. Fill out Data Safety section
6. Build and submit app!

EOF

echo "📝 Created: store-assets/playstore/README.md"
echo ""

# Create screenshots directory
mkdir -p store-assets/playstore/screenshots

echo "═══════════════════════════════════════════════════"
echo "✨ Store assets preparation complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📂 Assets location: store-assets/playstore/"
echo ""
echo "✅ Ready to upload:"
echo "   • icon-512.png (512x512)"
echo "   • feature-graphic.png (1024x500) - Consider enhancing!"
echo ""
echo "⚠️  Still needed:"
echo "   • 2-8 phone screenshots"
echo "   • Take screenshots of your running app"
echo "   • Save to: store-assets/playstore/screenshots/"
echo ""
echo "📖 See store-assets/playstore/README.md for detailed instructions"
echo ""
echo "🎨 Enhance your feature graphic:"
echo "   1. Open feature-graphic.png in design tool"
echo "   2. Add app mockups/screenshots"
echo "   3. Improve text and layout"
echo "   4. Make it eye-catching!"
echo ""
echo "📱 Create screenshots:"
echo "   1. Run: npx expo start"
echo "   2. Open app on your device"
echo "   3. Capture 5-8 key screens"
echo "   4. Save to screenshots folder"
echo ""
echo "═══════════════════════════════════════════════════"







