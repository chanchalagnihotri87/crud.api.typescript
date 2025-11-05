import {
  BlobDownloadResponseParsed,
  BlobSASPermissions,
  BlobServiceClient,
  BlobUploadCommonResponse,
  BlockBlobClient,
  ContainerClient,
  ContainerCreateResponse,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

import dotenv from "dotenv";

dotenv.config();

// Get connection string from environment variable
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
}

// Create BlobServiceClient
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

// UPLOAD A BLOB FROM STRING/BUFFER
export async function uploadBlob(
  containerName: string,
  blobName: string,
  content: string | Buffer
): Promise<string> {
  try {
    // Get container client
    const containerClient: ContainerClient =
      blobServiceClient.getContainerClient(containerName);

    // Create container if it doesn't exist
    const createResponse: ContainerCreateResponse =
      await containerClient.createIfNotExists({
        access: "blob", // or 'container' or 'private'
      });

    if (createResponse?.succeeded) {
      console.log(`Container created: ${containerName}`);
    }

    // Get blob client
    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    // Upload content
    const data = typeof content === "string" ? Buffer.from(content) : content;
    const uploadResponse: BlobUploadCommonResponse =
      await blockBlobClient.upload(data, data.length);

    console.log(`Upload successful: ${uploadResponse.requestId}`);

    return blockBlobClient.url;
  } catch (error) {
    console.error(
      "Upload error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// UPLOAD FROM FILE PATH
export async function uploadFile(
  containerName: string,
  blobName: string,
  filePath: string
): Promise<string> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload from file path
    await blockBlobClient.uploadFile(filePath);
    console.log(`File uploaded: ${blobName}`);

    return blockBlobClient.url;
  } catch (error) {
    console.error(
      "Upload error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// UPLOAD WITH METADATA AND CONTENT TYPE
export async function uploadBlobWithOptions(
  containerName: string,
  blobName: string,
  content: Buffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
      metadata,
    });

    console.log(`Uploaded ${blobName} with content type: ${contentType}`);
    return blockBlobClient.url;
  } catch (error) {
    console.error(
      "Upload error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// DOWNLOAD A BLOB
export async function downloadBlob(
  containerName: string,
  blobName: string
): Promise<Buffer> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Download blob content
    const downloadResponse: BlobDownloadResponseParsed =
      await blobClient.download();

    if (!downloadResponse.readableStreamBody) {
      throw new Error("No readable stream body");
    }

    const downloadedContent = await streamToBuffer(
      downloadResponse.readableStreamBody
    );

    console.log("Downloaded blob content");
    return downloadedContent;
  } catch (error) {
    console.error(
      "Download error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// DOWNLOAD TO FILE
export async function downloadToFile(
  containerName: string,
  blobName: string,
  downloadPath: string
): Promise<void> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    await blobClient.downloadToFile(downloadPath);
    console.log(`Downloaded to: ${downloadPath}`);
  } catch (error) {
    console.error(
      "Download error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// LIST BLOBS IN CONTAINER
export async function listBlobs(containerName: string): Promise<string[]> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    console.log(`Listing blobs in container: ${containerName}`);

    const blobs: string[] = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      console.log(`- ${blob.name}`);
      blobs.push(blob.name);
    }

    return blobs;
  } catch (error) {
    console.error(
      "List error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// LIST BLOBS WITH DETAILS
export async function listBlobsWithDetails(containerName: string) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({
        name: blob.name,
        properties: {
          contentLength: blob.properties.contentLength,
          contentType: blob.properties.contentType,
          lastModified: blob.properties.lastModified,
          createdOn: blob.properties.createdOn,
        },
        metadata: blob.metadata,
      });
    }

    return blobs;
  } catch (error) {
    console.error(
      "List error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// DELETE A BLOB
export async function deleteBlob(
  containerName: string,
  blobName: string
): Promise<void> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();
    console.log(`Deleted blob: ${blobName}`);
  } catch (error) {
    console.error(
      "Delete error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// CHECK IF BLOB EXISTS
export async function blobExists(
  containerName: string,
  blobName: string
): Promise<boolean> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    return await blobClient.exists();
  } catch (error) {
    console.error(
      "Exists check error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// GET BLOB URL WITH SAS TOKEN
export async function getBlobUrlWithSAS(
  containerName: string,
  blobName: string,
  expiryMinutes: number = 60
): Promise<string> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Parse connection string to get account name and key
    const parts = connectionString.split(";");
    const accountNamePart = parts.find((p) => p.startsWith("AccountName="));
    const accountKeyPart = parts.find((p) => p.startsWith("AccountKey="));

    if (!accountNamePart || !accountKeyPart) {
      throw new Error("Invalid connection string format");
    }

    const accountName = accountNamePart.split("=")[1];
    const accountKey = accountKeyPart.split("=")[1];

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // read permission
        startsOn: new Date(),
        expiresOn: new Date(Date.now() + expiryMinutes * 60 * 1000),
      },
      sharedKeyCredential
    ).toString();

    const sasUrl = `${blobClient.url}?${sasToken}`;
    return sasUrl;
  } catch (error) {
    console.error(
      "SAS generation error:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// Helper function to convert stream to buffer
async function streamToBuffer(
  readableStream: NodeJS.ReadableStream
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on("data", (data: Buffer | string) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}
