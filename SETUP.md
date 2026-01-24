# Quick Setup Guide - AI FaceSwap Photobooth

## ✅ What's Been Created

A complete React web application for AI-powered face swapping with:
- 6 screens following your exact flow
- Supabase integration (same as Flutter app)
- RunPod API integration (same logic as Flutter app)
- Modern, premium UI with glassmorphism design
- Webcam integration for photo capture
- QR code generation for easy downloads

## 📋 Next Steps to Get Started

### 1. Set Up Environment Variables

Create a `.env` file in the `faceswap-photobooth` directory:

```bash
cd /Users/cft_mac_mini/Documents/phone_pb_2025/faceswap-photobooth
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RUNPOD_FACESWAP_URL=your_runpod_endpoint
VITE_RUNPOD_API_KEY=your_runpod_api_key
```

**Note**: You can find these in your Flutter app's `.env` file.

### 2. Upload Character Images to Supabase

Create a bucket called `faceswap_characters` (if it doesn't exist) and upload images:

```
faceswap_characters/
├── male/
│   ├── image_01.png
│   ├── image_02.png
│   ├── image_03.png
│   └── image_04.png
└── female/
    ├── image_01.png
    ├── image_02.png
    ├── image_03.png
    └── image_04.png
```

**Important**: The structure is simpler than Flutter (no theme folder)
- Flutter: `accenture_themes/gender/theme/image.png`
- React: `faceswap_characters/gender/image.png`

### 3. Verify Supabase Table

The app uses the same `accenture_images` table as your Flutter app. Make sure it exists with these columns:
- `unique_id` (UUID, unique)
- `image_url` (TEXT)
- `gender` (TEXT)
- `characterimage` (TEXT)
- `output` (TEXT)
- `name` (TEXT, optional)
- `email` (TEXT, optional)
- `created_at` (TIMESTAMP)

### 4. Test the App

The dev server is already running at: **http://localhost:5173**

Open it in your browser to test!

## 🔄 Key Flow Comparison

### Flutter App Flow
1. Category Selection (AI Transformation vs BG Removal)
2. Gender Selection (if AI Transformation)
3. Theme Selection
4. Character Selection (based on gender + theme)
5. Face Capture
6. Processing
7. Output

### React App Flow (Simplified)
1. Welcome Screen ✨
2. Gender Selection
3. Character Selection (based on gender only - no theme)
4. Face Capture
5. Loading/Processing
6. Output with QR Code

## 🎨 Design Highlights

The React app features:
- **Glassmorphism** - Modern glass cards with blur effects
- **Smooth Gradients** - Rich, vibrant color schemes
- **Micro-animations** - Hover effects and transitions
- **Responsive Design** - Works on desktop and tablets
- **Premium Typography** - Inter font family
- **Dark Mode by Default** - Sleek dark theme

## 🔧 Technical Implementation

### Services (Same Logic as Flutter)

**SupabaseService** (`src/services/supabaseService.js`):
- `generateUniqueId()` - Creates UUID
- `uploadImageBytes()` - Uploads to storage bucket
- `getCharacterImages()` - Fetches character images by gender
- `saveImageRecord()` - Saves to database
- `updateCharacterImage()` - Updates character reference
- `updateOutputImage()` - Updates output URL
- `pollForOutput()` - Polls for completed results

**FaceSwapService** (`src/services/faceswapService.js`):
- `sendFaceSwapRequest()` - Sends job to RunPod
- `_pollJobStatus()` - Polls RunPod job status
- `checkJobStatus()` - Checks specific job completion

### State Management

Uses React Context (`src/context/AppContext.jsx`) to share state across screens:
- `uniqueId` - Session identifier
- `gender` - Selected gender
- `selectedCharacter` - Selected character data
- `capturedImage` - Base64 image data
- `capturedImageBlob` - Blob for upload
- `userImageUrl` - Uploaded user image URL
- `characterImageUrl` - Selected character URL
- `outputImageUrl` - Final processed image URL

## 🚀 Running Commands

```bash
# Development server (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Stop dev server
# Press Ctrl+C in the terminal
```

## 📝 What to Configure

Before the app works fully, you need to:

1. ✅ Add environment variables to `.env`
2. ✅ Upload character images to Supabase bucket `faceswap_characters`
3. ✅ Verify your RunPod endpoint is configured correctly
4. ✅ Test camera permissions in browser

## 🎯 Differences from Flutter App

1. **No Theme Selection** - Characters are fetched by gender only
2. **Simpler Bucket Structure** - `gender/image.png` instead of `gender/theme/image.png`
3. **No Gemini Integration** - Only RunPod faceswap (no BG removal mode)
4. **Web-based Camera** - Uses browser webcam API instead of native camera
5. **QR Code Download** - Added QR code for mobile downloads

## 💡 Tips

- The app expects exactly the same RunPod API format as your Flutter app
- All user images are saved to the same `accenture_images` bucket
- The polling mechanism is identical (60 attempts, 3-second intervals)
- Make sure Supabase buckets are set to **public** for image access

## 🐛 Troubleshooting

**App shows "No characters found"**
→ Check that images are uploaded to `faceswap_characters/male/` and `faceswap_characters/female/`

**Webcam not working**
→ Make sure you're using HTTPS or localhost (camera requires secure context)

**Images not uploading**
→ Check Supabase credentials in `.env` file

**Processing timeout**
→ Verify RunPod endpoint is working and saving output to Supabase

---

## 📞 Need Help?

Check the full README.md for detailed documentation.
The app is now ready to test at: http://localhost:5173
