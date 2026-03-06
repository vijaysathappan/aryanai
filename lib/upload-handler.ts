export async function uploadFile(file: File) {
  console.log("Uploading file:", file.name)

  // Future:
  // 1. Upload to cloud storage
  // 2. Send to RAG backend
  // 3. Return vector ID
  // 4. Trigger tool message

  return {
    success: true,
    fileName: file.name,
  }
}