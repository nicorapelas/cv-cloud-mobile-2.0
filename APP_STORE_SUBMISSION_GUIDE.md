# 📱 CV Cloud v2 - Complete App Store Submission Guide
**Last Updated:** November 7, 2025  
**App Version:** 2.0.0  
**Build System:** EAS Build

---

## 📋 TABLE OF CONTENTS

1. [Pre-Submission Checklist](#pre-submission-checklist)
2. [Google Play Store - Step by Step](#google-play-store)
3. [Apple App Store - Step by Step](#apple-app-store)
4. [Huawei AppGallery - Step by Step](#huawei-appgallery)
5. [Build Commands Reference](#build-commands-reference)
6. [Troubleshooting](#troubleshooting)
7. [Post-Launch Monitoring](#post-launch-monitoring)

---

## 🎯 PRE-SUBMISSION CHECKLIST

### ✅ Technical Requirements

- [x] **eas.json created** - Build configuration file ✅
- [x] **app.json updated** - All metadata complete ✅
- [x] **Bundle IDs configured**
  - Android: `com.cvcloud.app`
  - iOS: `com.cvcloud.app`
- [x] **Console statements removed** ✅
- [x] **Environment detection working** (dev/prod)
- [ ] **Production build tested locally**
- [ ] **Deep links tested**
- [ ] **All critical user flows tested**

### 📄 Legal & Content Requirements

- [x] **Terms & Conditions** - Available in-app ✅
- [x] **Privacy Policy** - Available in-app ✅
- [ ] **Privacy Policy URL** - Hosted at `https://cvcloud.com/privacy`
- [ ] **Terms URL** - Hosted at `https://cvcloud.com/terms`
- [ ] **Data Deletion Instructions** - Hosted at `https://cvcloud.com/data-deletion`
- [ ] **Support Email** - Set up support@cvcloud.com

### 🎨 Store Assets (Per Platform)

#### All Platforms
- [ ] **App Icon** (1024x1024, PNG, no transparency)
- [ ] **Feature Graphic** (1024x500 for Android)
- [ ] **Screenshots** (5-10 per device type)
- [ ] **App Description** (short & long)
- [ ] **Keywords/Categories**
- [ ] **Promotional Video** (optional but recommended)

---

## 📱 GOOGLE PLAY STORE

### PHASE 1: Account Setup (1-2 Weeks)

#### Step 1: Developer Account
```
Timeline: Immediate, but verification takes 1-2 weeks
Cost: $25 one-time fee
```

1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with your new Google account
3. Pay $25 registration fee
4. Complete identity verification
   - Upload government ID
   - Wait for verification (1-2 weeks)
5. Set up payment profile (for in-app purchases, if applicable)
6. Complete tax forms (W-8/W-9)

#### Step 2: Create App Listing

1. **Create App**
   ```
   - Click "Create app"
   - App name: "CV Cloud"
   - Default language: English
   - App/Game: App
   - Free/Paid: Free
   ```

2. **Store Listing**
   ```
   - App name: CV Cloud
   - Short description (80 chars):
     "Professional CV builder. Create stunning CVs in minutes with modern templates"
   
   - Full description (4000 chars):
     "CV Cloud - Your Professional CV Builder
     
     Create, customize, and share professional CVs in minutes with CV Cloud. 
     Perfect for job seekers, freelancers, and professionals looking to stand out.
     
     KEY FEATURES:
     • 9 Modern CV Templates - Choose from professional, creative, and tech-focused designs
     • Video Introduction - Record a 30-second video introduction to stand out
     • Easy Editing - Intuitive forms for all CV sections
     • Document Management - Upload certificates, supporting documents
     • Professional Photo - Capture or upload your professional headshot
     • Multiple Languages - Add language proficiency levels
     • Skills & Proficiencies - Showcase your expertise with visual indicators
     • Share Instantly - Email or share your CV directly from the app
     • Cloud Sync - Access your CV from mobile and web
     • Privacy Controls - Make your CV public or private
     
     PERFECT FOR:
     • Job seekers looking for their next opportunity
     • Graduates entering the job market
     • Freelancers building their portfolio
     • Professionals updating their CV
     • Anyone wanting a modern, professional CV
     
     WHY CV CLOUD?
     ✓ Quick Setup - Create your first CV in under 5 minutes
     ✓ Professional Templates - Designed by HR professionals
     ✓ Mobile-First - Built specifically for mobile convenience
     ✓ Free to Use - No hidden fees or subscriptions
     ✓ Secure & Private - Your data is encrypted and protected
     
     Start building your professional CV today with CV Cloud!"
   
   - App icon: Upload 512x512 PNG
   - Feature graphic: Upload 1024x500 PNG
   - Phone screenshots: Upload 2-8 (min 2)
   - 7-inch tablet screenshots: Upload 0-8 (optional)
   - 10-inch tablet screenshots: Upload 0-8 (optional)
   
   - Category: Business
   - Tags: cv, resume, job, career, professional
   ```

3. **Data Safety Section** ⚠️ **CRITICAL - NEW REQUIREMENT**
   ```
   Data Collected:
   ☑ Personal Info
     - Name, Email, Phone (Required for CV)
     - Purpose: App functionality
     - Sharing: No
   
   ☑ Photos & Videos
     - Photos, Videos (User-provided CV content)
     - Purpose: App functionality
     - Sharing: No
   
   ☑ Files & Docs
     - Files and documents (Certificates, supporting docs)
     - Purpose: App functionality
     - Sharing: No
   
   Security Practices:
   ☑ Data is encrypted in transit (HTTPS/TLS)
   ☑ Users can request data deletion
   ☑ Data is not shared with third parties
   ☑ Users can access/export their data
   
   Data Deletion:
   - Users can delete their account and all data from Settings
   - Contact support@cvcloud.com for assistance
   ```

4. **Privacy Policy**
   ```
   URL: https://cvcloud.com/privacy
   (Must be publicly accessible before submission)
   ```

### PHASE 2: App Content & Testing

#### Step 3: App Content

1. **Content Rating**
   ```
   - Complete questionnaire
   - Expected rating: Everyone / 3+
   - Content: Business/Productivity tool
   ```

2. **Target Audience**
   ```
   - Age group: 18+
   - Target audience: Professionals, job seekers
   ```

3. **News Apps** (if applicable)
   ```
   - Not a news app
   ```

4. **COVID-19 Contact Tracing** 
   ```
   - Not a contact tracing app
   ```

5. **Data Safety**
   - Complete as outlined above

#### Step 4: Testing Tracks

⚠️ **IMPORTANT:** Never submit directly to production. Use testing tracks first!

1. **Internal Testing** (Recommended First Step)
   ```bash
   # Build and submit to internal testing
   eas build --platform android --profile production
   eas submit --platform android --track internal
   ```
   
   - Set up internal testers (up to 100 email addresses)
   - Test for 1-2 days
   - Fix any crashes or critical bugs

2. **Closed Testing** (Alpha/Beta)
   ```bash
   eas submit --platform android --track beta
   ```
   
   - Create closed testing track
   - Add testers via email list
   - Test for 3-7 days
   - Gather feedback

3. **Open Testing** (Public Beta)
   ```bash
   eas submit --platform android --track alpha
   ```
   
   - Open to anyone with the link
   - Great for wider testing
   - Test for 1-2 weeks

### PHASE 3: Production Release

#### Step 5: Production Submission

```bash
# Final production build
eas build --platform android --profile production

# Submit to production
eas submit --platform android --track production
```

**Release Configuration:**
```
- Release name: CV Cloud v2.0.0
- Release notes:
  "Welcome to CV Cloud v2!
  
  What's New:
  • Brand new user interface
  • 9 professional CV templates
  • Video introduction feature
  • Improved document management
  • Enhanced privacy controls
  • Bug fixes and performance improvements"

- Rollout: Start with 20% staged rollout
- Countries: Start with your primary markets
```

#### Step 6: Post-Submission

**Timeline:** 1-7 days for review

**What Google Reviews:**
- App functionality
- Content policy compliance
- Data safety declarations
- Privacy policy validity
- Metadata accuracy

**If Rejected:**
- Read rejection reason carefully
- Fix the issue
- Resubmit
- Response time: Usually within 1-2 days

#### Step 7: Staged Rollout

```
Day 1: 20% rollout → Monitor crashes
Day 3: 50% rollout → Monitor reviews
Day 7: 100% rollout → Full release
```

---

## 🍎 APPLE APP STORE

### PHASE 1: Apple Developer Program

#### Step 1: Enroll in Apple Developer Program

```
Cost: $99/year
Timeline: 1-2 days for approval
```

1. Go to [Apple Developer](https://developer.apple.com)
2. Sign in with Apple ID
3. Enroll in Program
4. Choose Individual or Organization
5. Pay $99 annual fee
6. Wait for approval (1-2 days)

#### Step 2: Certificates, Identifiers & Profiles

1. **Create App ID**
   ```
   - Identifier: com.cvcloud.app
   - Explicit App ID (not wildcard)
   - Capabilities:
     ☑ Push Notifications (if you plan to use)
   ```

2. **Create Certificates**
   ```bash
   # EAS handles this automatically, but you may need to:
   # 1. Generate CSR (Certificate Signing Request)
   # 2. Download distribution certificate
   # 3. Install in Keychain
   ```

3. **Provisioning Profiles**
   ```
   - Development Profile: For local testing
   - App Store Profile: For distribution
   
   (EAS Build manages this automatically)
   ```

### PHASE 2: App Store Connect

#### Step 3: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps** → **+** → **New App**
   ```
   - Platform: iOS
   - Name: CV Cloud
   - Primary Language: English
   - Bundle ID: com.cvcloud.app
   - SKU: CV-CLOUD-001
   - User Access: Full Access
   ```

#### Step 4: App Information

```
- Name: CV Cloud
- Subtitle (30 chars): "Professional CV Builder"
- Category:
  Primary: Business
  Secondary: Productivity
- Content Rights: You own the content
- Age Rating: 4+ (Business/Productivity)
```

#### Step 5: Pricing & Availability

```
- Price: Free
- Availability: All territories
- Pre-orders: No (for initial release)
```

#### Step 6: App Privacy

⚠️ **CRITICAL:** Apple requires detailed privacy declarations

```
Data Types Collected:

1. Contact Info
   - Email Address
   - Phone Number
   - Purpose: App Functionality
   - Linked to User: Yes
   - Used for Tracking: No

2. User Content
   - Photos & Videos
   - Documents
   - Purpose: App Functionality
   - Linked to User: Yes
   - Used for Tracking: No

3. Identifiers
   - User ID
   - Purpose: App Functionality
   - Linked to User: Yes
   - Used for Tracking: No

Privacy Policy URL: https://cvcloud.com/privacy
```

#### Step 7: App Store Listing

**Screenshots Required:**
```
iPhone 6.7" (iPhone 14 Pro Max): 3-10 screenshots
iPhone 6.5" (iPhone 11 Pro Max): 3-10 screenshots (if different)
iPhone 5.5" (iPhone 8 Plus): Optional
iPad Pro 12.9": 3-10 screenshots

Sizes:
- 6.7": 1290 x 2796 pixels
- 6.5": 1242 x 2688 pixels
- iPad: 2048 x 2732 pixels
```

**App Preview Video:** (Optional but recommended)
```
- Up to 3 videos per device type
- 15-30 seconds
- Landscape or portrait
- Must show actual app functionality
```

**Description:**
```
(Use the same description as Google Play, max 4000 chars)
```

**Keywords:** (100 chars max, comma-separated)
```
cv,resume,job,career,professional,templates,video,portfolio,work,employment
```

**Promotional Text:** (170 chars, can update anytime)
```
Create professional CVs in minutes! 9 modern templates, video introductions, and easy sharing. Perfect for job seekers and professionals.
```

### PHASE 3: Build & Submit

#### Step 8: Build for iOS

```bash
# Configure iOS signing (first time only)
eas credentials

# Build for App Store
eas build --platform ios --profile production

# This will:
# 1. Build your app
# 2. Generate IPA file
# 3. Upload to App Store Connect automatically if configured
```

#### Step 9: TestFlight (Recommended)

```bash
# Submit to TestFlight
eas submit --platform ios
```

1. **Internal Testing** (Up to 100 testers)
   - Add testers in App Store Connect
   - They get instant access via TestFlight app
   - No review required

2. **External Testing** (Up to 10,000 testers)
   - Requires App Review (1-2 days)
   - Public link or invite-only
   - Great for beta testing

#### Step 10: Submit for Review

1. In App Store Connect:
   - Select your app
   - Click **+ Version** or **+** next to iOS App
   - Enter version: **2.0.0**

2. **Build Selection**
   - Select the build you uploaded
   - If multiple builds, choose the latest

3. **Version Information**
   ```
   What's New in This Version:
   
   "Welcome to CV Cloud v2.0!
   
   🎨 Brand New Design
   • Modern, intuitive interface
   • 9 professional CV templates
   • Smoother navigation
   
   🎬 New Features
   • Video introduction recording
   • Enhanced document management
   • Improved photo editing
   • Cloud sync across devices
   
   🔒 Privacy & Security
   • Enhanced privacy controls
   • Make your CV public or private
   • Secure data encryption
   
   ⚡ Performance
   • Faster loading times
   • Optimized for latest iOS
   • Bug fixes and stability improvements"
   ```

4. **App Review Information**
   ```
   - Contact Information:
     First Name: [Your Name]
     Last Name: [Your Name]
     Phone: [Your Phone]
     Email: support@cvcloud.com
   
   - Demo Account (if login required):
     Username: demo@cvcloud.com
     Password: [Create test account]
     
   - Notes:
     "CV Cloud is a professional CV builder app. Users can:
     1. Create account (or use demo account provided)
     2. Build CV using guided forms
     3. Choose from 9 templates
     4. Record optional video introduction
     5. Share or export CV
     
     All features are accessible from the dashboard after login."
   ```

5. **Version Release**
   ```
   ☑ Automatically release this version
   OR
   ☐ Manually release this version (you control when)
   ```

6. **Encryption Export Compliance**
   ```
   Does your app use encryption? YES
   
   Does your app qualify for exemption?
   ☑ YES - Standard encryption only (HTTPS)
   
   (You won't need to provide documentation for standard HTTPS)
   ```

7. **Click "Submit for Review"**

### PHASE 4: App Review Process

**Timeline:** 1-3 days (average: 24 hours)

**Statuses:**
```
Waiting for Review → In Review → Processing for App Store → Ready for Sale
```

**If Rejected:**
1. Read rejection carefully
2. Common reasons:
   - Crashes on reviewer's device
   - Broken features
   - Misleading screenshots
   - Privacy policy issues
   - Missing demo account
3. Fix issues
4. Resubmit
5. Add notes explaining what you fixed

**Appeal Process:**
- If you disagree with rejection
- Use Resolution Center
- Provide clear explanation

---

## 📱 HUAWEI APPGALLERY

### PHASE 1: Developer Account

#### Step 1: Register

1. Go to [Huawei Developer Console](https://developer.huawei.com)
2. Register account
3. Complete identity verification
4. No registration fee (FREE)

### PHASE 2: Create App

#### Step 2: App Information

```
- App Name: CV Cloud
- Package Name: com.cvcloud.app
- Category: Business
- Subcategory: Productivity Tools
- Languages: English
- Age Rating: 3+
```

#### Step 3: Build & Upload

```bash
# Build APK for Huawei
eas build --platform android --profile production

# Manually upload to Huawei Console
# (No automated submission yet)
```

1. Download APK from EAS Build
2. Upload to Huawei Developer Console
3. Fill out app information
4. Upload screenshots (same as Google Play)
5. Submit for review

**Review Timeline:** 2-3 days

---

## 🛠️ BUILD COMMANDS REFERENCE

### Initial Setup
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project
eas build:configure
```

### Development Builds
```bash
# Android development build
eas build --profile development --platform android

# iOS development build  
eas build --profile development --platform ios
```

### Preview/Testing Builds
```bash
# Android APK for testing
eas build --profile preview --platform android

# iOS simulator build
eas build --profile preview --platform ios
```

### Production Builds
```bash
# Android (App Bundle for Play Store)
eas build --platform android --profile production

# iOS (IPA for App Store)
eas build --platform ios --profile production

# Both platforms
eas build --platform all --profile production
```

### Submission
```bash
# Submit to Google Play (internal track)
eas submit --platform android --track internal

# Submit to Google Play (production)
eas submit --platform android --track production

# Submit to App Store (TestFlight)
eas submit --platform ios

# Check submission status
eas submit --status
```

### Build Management
```bash
# List all builds
eas build:list

# View specific build
eas build:view [build-id]

# Cancel build
eas build:cancel [build-id]
```

---

## 🔧 TROUBLESHOOTING

### Common Build Issues

#### 1. Android Build Fails
```
Error: Gradle build failed

Solution:
1. Check app.json for proper package name
2. Verify permissions are valid
3. Check for conflicting dependencies
4. Clear EAS cache: eas build --clear-cache
```

#### 2. iOS Build Fails
```
Error: Provisioning profile doesn't include signing certificate

Solution:
1. Run: eas credentials
2. Select "Set up signing credentials from scratch"
3. Let EAS manage certificates
```

#### 3. Build Timeout
```
Solution:
- Optimize dependencies
- Remove large assets
- Use --clear-cache flag
```

### Common Submission Issues

#### 1. Google Play Rejection

**Issue:** "Your app doesn't comply with Data Safety requirements"
```
Solution:
- Review Data Safety section
- Ensure all collected data is declared
- Privacy policy must be accessible
```

**Issue:** "Your app crashed during review"
```
Solution:
- Test on physical devices
- Check crash logs in Play Console
- Fix crashes and resubmit
```

#### 2. Apple App Store Rejection

**Issue:** "Guideline 2.1 - Performance - App Completeness"
```
Solution:
- Ensure all features work
- Provide working demo account
- Add clear instructions in review notes
```

**Issue:** "Guideline 5.1.1 - Legal - Privacy - Data Collection and Storage"
```
Solution:
- Update privacy policy
- Ensure App Privacy declarations match actual behavior
- Add clear user consent flows
```

---

## 📊 POST-LAUNCH MONITORING

### Week 1: Critical Monitoring

**Daily Checks:**
- [ ] **Crash Rate** - Should be < 1%
  - Google: Play Console → Vitals → Crashes
  - Apple: App Store Connect → TestFlight/App Analytics → Crashes
  
- [ ] **ANR Rate** (Android) - Should be < 0.5%
  - Play Console → Vitals → ANRs
  
- [ ] **Reviews** - Respond within 24 hours
  - Monitor 1-star reviews closely
  - Thank positive reviewers
  
- [ ] **Installs vs Uninstalls**
  - Healthy ratio: < 20% uninstalls
  
- [ ] **Server Errors** (if applicable)
  - Monitor API response times
  - Check error rates

**Metrics to Track:**
```
- Downloads
- Active users
- Retention (Day 1, Day 7, Day 30)
- Session length
- Feature usage
- Conversion rate (if applicable)
```

### Week 2-4: Optimization

- [ ] Analyze user behavior
- [ ] Identify drop-off points
- [ ] Plan updates based on feedback
- [ ] Optimize ASO (App Store Optimization)

### Ongoing Maintenance

**Monthly:**
- [ ] Review crash reports
- [ ] Update app with bug fixes
- [ ] Respond to all reviews
- [ ] Monitor competitor apps
- [ ] Update screenshots if needed

**Quarterly:**
- [ ] Major feature updates
- [ ] Refresh screenshots
- [ ] Update descriptions
- [ ] Review keywords
- [ ] Check for policy changes

---

## 📞 SUPPORT RESOURCES

### Google Play Console
- **Help Center:** https://support.google.com/googleplay/android-developer
- **Policy Center:** https://play.google.com/about/developer-content-policy/
- **Status Dashboard:** https://status.cloud.google.com/

### Apple App Store
- **App Review:** https://developer.apple.com/app-store/review/
- **Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Support:** https://developer.apple.com/support/

### EAS Build
- **Documentation:** https://docs.expo.dev/build/introduction/
- **Troubleshooting:** https://docs.expo.dev/build-reference/troubleshooting/
- **Forum:** https://forums.expo.dev/

---

## ✅ FINAL PRE-LAUNCH CHECKLIST

### 24 Hours Before Launch

- [ ] All builds uploaded and tested
- [ ] Privacy policy live and accessible
- [ ] Terms of service live and accessible
- [ ] Support email set up and monitored
- [ ] Analytics configured
- [ ] Crash reporting enabled (Sentry recommended)
- [ ] Server capacity checked
- [ ] Database backups automated
- [ ] Monitoring dashboards ready
- [ ] Team briefed on support process
- [ ] Social media announcements prepared
- [ ] Press kit ready (if applicable)

### Launch Day

- [ ] Submit for review on all platforms
- [ ] Monitor submission status
- [ ] Prepare to respond to review questions
- [ ] Have team on standby for critical issues
- [ ] Monitor social media
- [ ] Respond to first reviews
- [ ] Check server metrics

### Post-Launch (First 72 Hours)

- [ ] Monitor crashes every 4 hours
- [ ] Respond to all reviews
- [ ] Track key metrics
- [ ] Fix critical bugs immediately
- [ ] Prepare hotfix if needed
- [ ] Document lessons learned

---

## 🎉 SUCCESS METRICS

**Week 1 Goals:**
- 100+ downloads
- < 1% crash rate
- 4+ star average rating
- < 5% uninstall rate

**Month 1 Goals:**
- 1,000+ downloads
- 10+ reviews
- 30% Day-7 retention
- Feature in store (if possible)

**Month 3 Goals:**
- 10,000+ downloads
- 50+ reviews
- 20% Day-30 retention
- Profitable (if monetized)

---

**Good luck with your launch! 🚀**

*This guide will be updated as you progress through the submission process.*









