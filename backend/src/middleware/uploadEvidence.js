import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "certification_evidence",

    resource_type: "auto", // allows pdf, doc, images

    allowed_formats: [
      "pdf",
      "png",
      "jpg",
      "jpeg",
      "doc",
      "docx",
      "xls",
      "xlsx"
    ],

    public_id: (req, file) => {
      return Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    }
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export default upload;