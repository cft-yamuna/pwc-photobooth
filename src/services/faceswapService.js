import { appConfig } from "../config/appConfig";

class FaceSwapService {
  /**
   * Send face swap request to RunPod
   */
  async sendFaceSwapRequest({ sourceImageUrl, targetImageUrl, uniqueId }) {
    try {
      const response = await fetch(appConfig.runpod.faceswapUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appConfig.runpod.apiKey}`,
        },
        body: JSON.stringify({
          input: {
            source_image_url: sourceImageUrl,
            target_image_url: targetImageUrl,
            unique_id: uniqueId,
          },
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const jobId = responseData.id;

        if (jobId) {
          // Start polling for completion in background
          this._pollJobStatus(jobId, uniqueId);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error sending face swap request:", error);
      return false;
    }
  }

  /**
   * Poll RunPod job status
   */
  async _pollJobStatus(jobId, uniqueId) {
    const maxPollingAttempts = appConfig.polling.maxAttempts;
    const pollInterval = appConfig.polling.interval;

    for (let attempt = 0; attempt < maxPollingAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      try {
        const statusUrl = `${appConfig.runpod.faceswapUrl.replace(
          "/run",
          ""
        )}/status/${jobId}`;

        const response = await fetch(statusUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${appConfig.runpod.apiKey}`,
          },
        });

        if (response.ok) {
          const statusData = await response.json();
          const status = statusData.status;

          if (status === "COMPLETED") {
            // Job completed successfully
            // The RunPod handler should have already saved the result to Supabase
            console.log(
              "RunPod job completed successfully for uniqueId:",
              uniqueId
            );
            return;
          } else if (status === "FAILED") {
            console.error("RunPod job failed for uniqueId:", uniqueId);
            return;
          }
          // If status is 'IN_PROGRESS' or 'IN_QUEUE', continue polling
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }

    console.error("RunPod job polling timeout for uniqueId:", uniqueId);
  }

  /**
   * Check if a specific job is complete (alternative polling method)
   */
  static async checkJobStatus({ jobId, apiUrl, apiKey }) {
    try {
      const statusUrl = `${apiUrl.replace("/run", "")}/status/${jobId}`;

      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const statusData = await response.json();
        const status = statusData.status;

        return status === "COMPLETED";
      }

      return false;
    } catch (error) {
      console.error("Error checking job status:", error);
      return false;
    }
  }
}

export default FaceSwapService;
