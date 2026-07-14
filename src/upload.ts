/**
 * Upload a binary Blob (image) to the Unity local server.
 * This uses raw binary POST.
 * 
 * This will upload image to assets folder in its proper directory (eg: draw_0.png)
 */

//To test this put the files in application persistent path of unity project
//because that server is enabled with post request (for now)

export async function uploadImage(
  blob: Blob,
  filename: string
): Promise<void> {
  // Build upload URL, path is maintained by server (local server in unity script)
  const url = `/upload?name=${encodeURIComponent(filename)}`;

  // Send raw binary data
  const response: Response = await fetch(url, {
    method: "POST",
    headers: {
      // Content-Type helps the server know what this is
      "Content-Type": blob.type || "application/octet-stream"
    },
    body: blob
  });

  // Handle server errors
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }
}
