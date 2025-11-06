import { Request } from "express";
import multer from "multer";
import { MulterAzureStorage } from "multer-azure-blob-storage";

const azureStorage = new MulterAzureStorage({
  connectionString:
    process.env.AZURE_STORAGE_CONNECTION_STRING ||
    "DefaultEndpointsProtocol=https;AccountName=typescriptcrudapistorage;AccountKey=LzOUKO+oEP17bX20UmriHRHAGhG363gULZjSMJEKRWo7yLMra9sbGrmJO6bP6vPndDwSXKl6U10f+AStacEdxA==;EndpointSuffix=core.windows.net", // or accountName and accountKey
  accessKey:
    "LzOUKO+oEP17bX20UmriHRHAGhG363gULZjSMJEKRWo7yLMra9sbGrmJO6bP6vPndDwSXKl6U10f+AStacEdxA==",
  accountName: "typescriptcrudapistorage",
  containerName: "images",
  blobName: (req, file) => {
    const fileName = Date.now() + "-" + file.originalname;
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(fileName);
      }, 100)
    );
  }, // Customize blob name
  // Optional: customize metadata, content settings
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  //We can check for mime type or other checks
  if (file) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//USE CASE 1: Use default callback which will be called on every request
// app.use(
//   multer({ storage: storage, fileFilter: fileFilter }).single("PhotoFile")
// );

//USE CASE 2: Use conditional callback which can be integrated on required callback.
const upload = multer({ storage: azureStorage, fileFilter: fileFilter });

export default upload;
