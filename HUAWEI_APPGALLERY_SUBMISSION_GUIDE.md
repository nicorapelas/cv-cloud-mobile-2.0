# Huawei AppGallery Submission Guide

This guide walks you through submitting CV Cloud to Huawei AppGallery.

## Prerequisites

✅ You've already signed up and logged into [Huawei Developer Portal](https://developer.huawei.com/)

---

## ⚠️ Package Name Mismatch Issue

**Important**: Your existing AppGallery app (Version 1) uses package name `app.cvcloud.www`, but your current codebase uses `com.cvcloud.app` (which matches Google Play Store).

**Since you're prioritizing Google Play Store** (already in testing, almost ready to publish), you have two options:

### Option A: Create New App Listing in AppGallery (Recommended)

Since the package names don't match, you'll need to create a **new app listing** in AppGallery with package name `com.cvcloud.app`. This means:
- ✅ No impact on Google Play Store
- ✅ Can use the same build/package as Play Store
- ❌ Will be a separate app listing (won't update existing v1 users)
- ❌ Existing AppGallery users on v1 won't automatically get the update

**Steps:**
1. In AppGallery Connect, create a **new app** with package name `com.cvcloud.app`
2. Build with your current configuration (no changes needed)
3. Upload to the new app listing

### Option B: Wait Until After Play Store Launch

1. Complete Google Play Store launch first
2. After Play Store is live, decide if you want to:
   - Keep separate listings (AppGallery v1 with `app.cvcloud.www`, new version with `com.cvcloud.app`)
   - Or migrate AppGallery users to the new package (requires communication/instructions)

### Current Configuration

- **Google Play Store**: `com.cvcloud.app` ✅ (unchanged, safe)
- **AppGallery (existing)**: `app.cvcloud.www` (different package)
- **Your codebase**: `com.cvcloud.app` ✅ (matches Play Store)

---

## 🆕 Creating New App (First Time Submission)

If you're creating a new app listing, follow the full guide below.

---

## Important Requirements

- **64-bit architecture**: Mandatory (your Expo build already includes this)
- **Package name**: Must match `com.cvcloud.app` (already configured)
- **App signing**: Huawei can manage signing OR you can upload your own certificate
- **Format**: AAB (Android App Bundle) is preferred, APK also accepted

---

## Step 1: Build Your App for Huawei

From the `mobile` directory:

```bash
eas build --platform android --profile huawei
```

This will:
- Build an AAB (Android App Bundle) signed with your EAS credentials
- Upload it to EAS servers
- Provide a download link when complete

**Note**: Download the `.aab` file from the EAS build page - you'll need it for Step 3.

---

## Step 2: Get Your Upload Certificate (for App Signing)

Huawei requires an upload certificate for their App Signing service. Get it from EAS:

```bash
eas credentials
```

Then select:
- **Platform**: Android
- **Action**: Download credentials
- **What to download**: Upload certificate (`.pem` file)

**OR** use the Expo CLI command:

```bash
expo fetch:android:upload-cert
```

This downloads `upload_certificate.pem` - **save this file**, you'll upload it to Huawei in Step 4.

---

## Step 3: Create App in AppGallery Connect

**⚠️ Important**: Since your existing AppGallery app uses `app.cvcloud.www` but your codebase uses `com.cvcloud.app`, you'll need to create a **new app listing** (not update the existing one).

1. **Log in** to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html)

2. **Create/Select Project**:
   - Go to **My Projects**
   - Click **Add Project** (or select existing)
   - Enter project name: "CV Cloud"

3. **Add App** (NEW listing):
   - In your project, click **Add App**
   - Fill in:
     - **App name**: `CV Cloud` (or `CV Cloud 2.0` to distinguish from v1)
     - **Package name**: `com.cvcloud.app` (must match your `app.json` exactly)
     - **Category**: `App` → `Productivity` (or appropriate category)
     - **Default language**: `English`
     - **App type**: `App` (not Game)
   - Click **OK**
   
   **Note**: This creates a new app listing. Your existing v1 app (`app.cvcloud.www`) will remain separate.

4. **Complete App Information**:
   - Go to **App Information** section
   - Fill required fields:
     - App description (use from `app.json`: "Professional CV builder and manager...")
     - Privacy policy URL (required if app collects data)
     - Support URL
     - Contact email

---

## Step 4: Configure App Signing

Huawei offers two options:

### Option A: Let Huawei Manage Signing (Recommended for AAB)

1. Go to **App Signing** in AppGallery Connect
2. Select **"Create and manage my app signature key"**
3. Upload the `upload_certificate.pem` file you downloaded in Step 2
4. Huawei will generate and manage the final signing key

### Option B: Upload Your Own Certificate

1. Select **"Export and upload the key and certificate"**
2. Upload your keystore certificate (`.pem` format)
3. You'll need to maintain this certificate for all future updates

**⚠️ Important**: Once you choose a signing method, you **cannot change it** later. All future versions must use the same signing method.

---

## Step 5: Upload App Package

1. Go to **Distribute** → **Version Information**
2. Click **Create Version** (or edit draft if exists)
3. Fill in:
   - **Version number**: `2.0.31` (must match `expo.version` in `app.json`)
   - **Version code**: `44` (must match `android.versionCode` in `app.json`)
     - **⚠️ For updates**: Version code MUST be higher than the current version in AppGallery
     - If you get "version code already used", increment it in `app.json` and rebuild
   - **What's new**: Changelog for this version (describe changes from previous version)
4. Under **Software Packages**, click **Upload**
5. Upload the `.aab` file you downloaded from EAS Build (Step 1)
6. Wait for processing (usually 5-10 minutes)

---

## Step 6: Upload App Assets

Go to **App Information** → **Multimedia** and upload:

### Required Assets:
- **App icon**: 450×450 px (PNG, no transparency)
- **Feature graphic**: 1024×500 px (PNG/JPG)
- **Screenshots**: 
  - Phone: 450×800 px (portrait) or 800×450 px (landscape)
  - Tablet: 1200×1920 px (portrait) or 1920×1200 px (landscape)
  - Minimum 3 screenshots required

### Optional Assets:
- Promotional video
- Promotional images

**Tip**: You can use the same assets from Google Play Store if you have them.

---

## Step 7: Complete Additional Information

1. **Content Rating**:
   - Complete the content rating questionnaire
   - Based on your app features (CV builder, video uploads, etc.)

2. **Pricing & Distribution**:
   - Set app as **Free** or **Paid**
   - Select target countries/regions
   - **Note**: If including Chinese Mainland, additional documentation may be required

3. **Privacy Policy**:
   - Upload privacy policy URL (required if app collects user data)

4. **Permissions**:
   - Review and explain why your app needs:
     - Camera (for video recording)
     - Microphone (for video audio)
     - Storage (for saving CVs)
     - Internet (for cloud sync)

---

## Step 8: Submit for Review

1. Review all sections - they should show green checkmarks ✅
2. Ensure:
   - ✅ App package uploaded and processed
   - ✅ App signing configured
   - ✅ App information complete
   - ✅ Assets uploaded
   - ✅ Content rating complete
   - ✅ Privacy policy provided

3. Click **Submit** button

4. **Review Process**:
   - Typical review time: **1-2 business days**
   - You'll receive email notifications about status
   - Check status in AppGallery Connect dashboard

---

## Step 9: Monitor Submission Status

- Go to **Distribute** → **Version Information**
- Check status:
  - **In Review**: Being reviewed by Huawei
  - **Rejected**: Review feedback provided (fix and resubmit)
  - **Published**: Live on AppGallery! 🎉

---

## Updating Your App (Future Versions)

For future updates:

1. **Increment version numbers** in `app.json`:
   ```json
   {
     "expo": {
       "version": "2.0.32",  // Increment
       "android": {
         "versionCode": 45     // Increment
       }
     }
   }
   ```

2. **Build new version**:
   ```bash
   eas build --platform android --profile huawei
   ```

3. **Upload to AppGallery Connect**:
   - Go to **Distribute** → **Version Information**
   - Click **Create Version**
   - Upload new `.aab` file
   - Fill changelog
   - Submit for review

---

## Troubleshooting

### "Version code already used"
- Increment `android.versionCode` in `app.json` and rebuild

### "Package name mismatch"
- Ensure `android.package` in `app.json` matches exactly what you entered in AppGallery Connect

### "App signing error"
- Verify you uploaded the correct `.pem` certificate
- If using Huawei's signing, ensure you uploaded the upload certificate (not the final signing certificate)

### "64-bit architecture required"
- Your Expo build already includes 64-bit support, but if rejected, check that all native libraries are 64-bit compatible

### Build fails or takes too long
- Check EAS build logs: https://expo.dev/accounts/nicorapelas/projects/cv-cloud-mobile-rebuild/builds
- Ensure you have sufficient EAS build quota

---

## Additional Resources

- [Huawei AppGallery Connect Documentation](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-get-started)
- [Huawei App Signing Guide](https://developer.huawei.com/consumer/en/doc/development/AppGallery-connect-Guides/agc-app-signing-overview)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

## Quick Checklist

Before submitting, ensure:

- [ ] App built with `eas build --platform android --profile huawei`
- [ ] `.aab` file downloaded from EAS
- [ ] Upload certificate (`.pem`) downloaded
- [ ] App created in AppGallery Connect with correct package name
- [ ] App signing configured (Huawei-managed or own certificate)
- [ ] App package uploaded and processed
- [ ] App icon and screenshots uploaded
- [ ] App information and description filled
- [ ] Content rating completed
- [ ] Privacy policy URL provided
- [ ] All sections show green checkmarks
- [ ] Ready to submit! 🚀
