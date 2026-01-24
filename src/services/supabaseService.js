import { createClient } from "@supabase/supabase-js";
import { appConfig } from "../config/appConfig";

// Create a single client instance
const supabaseClient = createClient(
  appConfig.supabase.url,
  appConfig.supabase.anonKey
);

class SupabaseService {
  constructor() {
    this.client = supabaseClient;
  }

  /**
   * Generate a unique ID for user session
   */
  generateUniqueId() {
    return crypto.randomUUID();
  }

  /**
   * Upload user captured image to Supabase storage
   */
  async uploadImageBytes(imageBlob, uniqueId, options = {}) {
    const {
      bucket = appConfig.buckets.images,
      prefix = "user_",
      extension = ".jpg",
    } = options;

    try {
      const fileName = `${prefix}${uniqueId}_${Date.now()}${extension}`;

      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(fileName, imageBlob);

      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }

      if (data) {
        const {
          data: { publicUrl },
        } = this.client.storage.from(bucket).getPublicUrl(fileName);
        return publicUrl;
      }

      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }

  /**
   * Get character images based on gender from Supabase bucket
   */
  async getCharacterImages(gender) {
    try {
      const bucket = appConfig.buckets.characters;
      const folder = gender.toLowerCase(); // 'male' or 'female'

      // List all files in the gender folder
      const { data, error } = await this.client.storage
        .from(bucket)
        .list(folder);

      if (error) {
        console.error("Error fetching character images:", error);
        return [];
      }

      // Get public URLs for all images (limit to 4 as per requirements)
      const imageUrls = data
        .filter(
          (file) => file.name.endsWith(".png") || file.name.endsWith(".jpg")
        )
        .slice(0, 4)
        .map((file) => {
          const {
            data: { publicUrl },
          } = this.client.storage
            .from(bucket)
            .getPublicUrl(`${folder}/${file.name}`);
          return {
            url: publicUrl,
            name: file.name,
          };
        });

      return imageUrls;
    } catch (error) {
      console.error("Error getting character images:", error);
      return [];
    }
  }

  /**
   * Save image record to database
   */
  async saveImageRecord({
    uniqueId,
    imageUrl,
    gender,
    characterImage,
    userName,
    userEmail,
    eventId = "default-event",
    userId = "guest",
    creditsUsed = "1",
  }) {
    try {
      const { error } = await this.client.from(appConfig.tables.images).insert({
        unique_id: uniqueId,
        image_url: imageUrl,
        gender: gender,
        characterimage: characterImage,
        name: userName,
        email: userEmail,
        eventId: eventId,
        userId: userId,
        creditsUsed: creditsUsed,
      });

      if (error) {
        console.error("Error saving image record:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving image record:", error);
      return false;
    }
  }

  /**
   * Update the character image URL after selection
   */
  async updateCharacterImage(uniqueId, characterImageUrl) {
    try {
      const { error } = await this.client
        .from(appConfig.tables.images)
        .update({ characterimage: characterImageUrl })
        .eq("unique_id", uniqueId);

      if (error) {
        console.error("Error updating character image:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating character image:", error);
      return false;
    }
  }

  /**
   * Update the output image URL after processing
   */
  async updateOutputImage(uniqueId, outputUrl) {
    try {
      const { error } = await this.client
        .from(appConfig.tables.images)
        .update({ output: outputUrl })
        .eq("unique_id", uniqueId);

      if (error) {
        console.error("Error updating output image:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating output image:", error);
      return false;
    }
  }

  /**
   * Poll for processed output image
   */
  async pollForOutput(uniqueId, maxAttempts = appConfig.polling.maxAttempts) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const { data, error } = await this.client
          .from(appConfig.tables.images)
          .select("output")
          .eq("unique_id", uniqueId)
          .single();

        if (error) {
          console.error("Error polling for output:", error);
          await new Promise((resolve) =>
            setTimeout(resolve, appConfig.polling.interval)
          );
          continue;
        }

        const outputUrl = data?.output;
        if (outputUrl && outputUrl.trim() !== "") {
          return outputUrl;
        }

        // Wait before next attempt
        await new Promise((resolve) =>
          setTimeout(resolve, appConfig.polling.interval)
        );
      } catch (error) {
        console.error("Error polling for output:", error);
        await new Promise((resolve) =>
          setTimeout(resolve, appConfig.polling.interval)
        );
      }
    }

    return null; // Timeout
  }

  /**
   * Get the latest output image for a unique ID
   */
  async getLatestOutputImage(uniqueId) {
    try {
      const { data, error } = await this.client
        .from(appConfig.tables.images)
        .select("output")
        .eq("unique_id", uniqueId)
        .single();

      if (error) {
        console.error("Error getting latest output image:", error);
        return null;
      }

      return data?.output || null;
    } catch (error) {
      console.error("Error getting latest output image:", error);
      return null;
    }
  }

  /**
   * Search users by name (for autocomplete)
   */
  async searchUsers(query) {
    try {
      const { data, error } = await this.client
        .from(appConfig.tables.users)
        .select("*")
        .ilike("full_name", `%${query}%`)
        .limit(10);

      if (error) {
        console.error("Error searching users:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  /**
   * Get all users (for initial load)
   */
  async getAllUsers() {
    try {
      const { data, error } = await this.client
        .from(appConfig.tables.users)
        .select("*")
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Error fetching all users:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  /**
   * Register new user
   */
  async registerUser({ firstName, lastName, email, tag }) {
    try {
      const fullName = `${firstName} ${lastName}`.trim();

      const { data, error } = await this.client
        .from(appConfig.tables.users)
        .insert({
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          email: email,
          tag: tag,
        })
        .select()
        .single();

      if (error) {
        console.error("Error registering user:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error registering user:", error);
      return null;
    }
  }
}

export default SupabaseService;
