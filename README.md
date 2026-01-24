# AI FaceSwap Photobooth - React Web App

A modern, premium React web application for AI-powered face swapping. Users can select a gender, choose from character images, capture their photo, and get a face-swapped result powered by RunPod API.

## 🎨 Features

- **Modern UI/UX**: Glassmorphism design with smooth animations and gradients
- **6-Screen Flow**:
  1. Welcome Screen - Introduction and start button
  2. Gender Selection - Choose Male or Female
  3. Character Selection - View and select from 4 character images
  4. Face Capture - Webcam integration to capture user photo
  5. Loading Screen - Real-time processing status with polling
  6. Output Screen - Display result with QR code for download

- **Supabase Integration**: Image storage and database management
- **RunPod API**: AI-powered face swap processing
- **QR Code Generation**: Easy mobile download of results
- **Responsive Design**: Works on desktop and tablet devices

## 🚀 Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Supabase** - Backend and storage
- **RunPod API** - AI face swap processing  
- **react-webcam** - Camera integration
- **qrcode** - QR code generation
- **Vanilla CSS** - Custom design system

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project
- RunPod API key and endpoint

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd faceswap-photobooth
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RUNPOD_FACESWAP_URL=your_runpod_endpoint_url
VITE_RUNPOD_API_KEY=your_runpod_api_key
```

### 3. Set Up Supabase

#### Create Storage Buckets

Create two public storage buckets in Supabase:

1. **`accenture_images`** - For user uploaded images and outputs
2. **`faceswap_characters`** - For character images

#### Upload Character Images

Upload character images to the `faceswap_characters` bucket with this structure:

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

**Note**: The app will fetch and display 4 images per gender. Make sure you have at least 4 images in each folder.

#### Create Database Table

Create a table named `accenture_images` with the following schema:

```sql
CREATE TABLE accenture_images (
  id BIGSERIAL PRIMARY KEY,
  unique_id UUID UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  gender TEXT,
  characterimage TEXT,
  output TEXT,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Configure RunPod

Your RunPod endpoint should:
- Accept POST requests with `source_image_url`, `target_image_url`, and `unique_id`
- Return a job ID for polling
- Save the output image URL to Supabase `accenture_images` table when complete
- Support status checking via `/status/{jobId}` endpoint

Expected request format:
```json
{
  "input": {
    "source_image_url": "https://...",
    "target_image_url": "https://...",
    "unique_id": "abc-123-def"
  }
}
```

Expected response:
```json
{
  "id": "job-id-here",
  "status": "IN_QUEUE"
}
```

Status endpoint should return:
```json
{
  "status": "COMPLETED" | "IN_PROGRESS" | "IN_QUEUE" | "FAILED"
}
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
faceswap-photobooth/
├── public/              # Static assets
├── src/
│   ├── config/          # Configuration files
│   │   └── appConfig.js
│   ├── context/         # React Context for state management
│   │   └── AppContext.jsx
│   ├── screens/         # Screen components
│   │   ├── WelcomeScreen.jsx
│   │   ├── GenderSelectionScreen.jsx
│   │   ├── CharacterSelectionScreen.jsx
│   │   ├── FaceCaptureScreen.jsx
│   │   ├── LoadingScreen.jsx
│   │   └── OutputScreen.jsx
│   ├── services/        # API services
│   │   ├── supabaseService.js
│   │   └── faceswapService.js
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Design system and styles
├── .env                 # Environment variables (create this)
├── .env.example         # Environment variables template
├── package.json
└── vite.config.js
```

## 🎯 Usage Flow

1. **Welcome Screen**: User clicks "Start Your Journey"
2. **Gender Selection**: User selects Male or Female
3. **Character Selection**: User views 4 characters and selects one
4. **Face Capture**: User captures their photo using webcam
5. **Loading Screen**: Image is uploaded, RunPod job starts, polling begins
6. **Output Screen**: Final result displayed with download options (direct download + QR code)

## 🔧 Key Differences from Flutter App

Since there are no theme selections in this React version (unlike the Flutter app), the character images are fetched directly from gender folders:
- Flutter structure: `gender/theme/image.png`
- React structure: `gender/image.png`

The app fetches all images from the gender folder and displays the first 4.

## 🐛 Troubleshooting

### Webcam Not Working
- Ensure you've granted camera permissions in your browser
- Use HTTPS or localhost (camera API requires secure context)

### Images Not Loading
- Check Supabase bucket permissions are set to public
- Verify bucket names in `appConfig.js` match your Supabase setup
- Check browser console for CORS errors

### RunPod Processing Fails
- Verify API key and endpoint URL in `.env`
- Check RunPod logs for errors
- Ensure your RunPod handler saves output to Supabase correctly

### Polling Timeout
- Default timeout is 60 attempts × 3 seconds = 3 minutes
- Adjust in `appConfig.js` if needed

## 📝 License

This project is part of the Accenture AI Photobooth system.

## 🤝 Support

For issues or questions, please check the console logs and Supabase/RunPod dashboards for error details.
