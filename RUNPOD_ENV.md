# RunPod Environment Variables

Add these environment variables to your RunPod configuration to ensure it connects to your Supabase project correctly.

## Required Variables

| Key                     | Value                                      | Description                                       |
| :---------------------- | :----------------------------------------- | :------------------------------------------------ |
| **`SUPABASE_URL`**      | `https://ozkbnimjuhaweigscdby.supabase.co` | Your Supabase Project URL                         |
| **`SUPABASE_ANON_KEY`** | _(Your Supabase Anon Key)_                 | Found in your Supabase Dashboard > Settings > API |
| **`SUPABASE_BUCKET`**   | `phonepe_images`                           | Bucket where output images will be uploaded       |
| **`SUPABASE_TABLE`**    | `event_output_images`                      | Table to update with the result URL               |

## How to Configure

1. Go to your **RunPod Dashboard**.
2. Select your **Pod** or **Template**.
3. Click on **Environment Variables**.
4. Add each key-value pair.
5. **Restart** the pod.

## Verification

The handler code uses these variables to:

1. Connect to Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
2. Upload the processed face-swap image to the bucket (`SUPABASE_BUCKET`)
3. Update the `output` column in the database table (`SUPABASE_TABLE`) for the given `unique_id`
