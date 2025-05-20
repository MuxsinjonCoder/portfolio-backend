import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
}

// Firebase service accountni to'g'ri parse qilish va private_key dagi \n ni yangi qatorga almashtirish
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "cyber-shop-uz.firebasestorage.app",
  });
}

const uploadFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const bucket = admin.storage().bucket();
  const fileName = `portfolio-website/${Date.now()}_${file.originalname}`;

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: { contentType: file.mimetype },
    public: true,
  });

  blobStream.on("error", (err) => {
    console.error("Blob stream error:", err);
    res.status(500).json({ error: "File upload failed" });
  });

  blobStream.on("finish", async () => {
    try {
      await blob.makePublic();
      const fileUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(fileName)}`;
      res.json({ message: "File uploaded successfully!", url: fileUrl });
    } catch (err) {
      console.error("Error making file public:", err);
      res.status(500).json({ error: "Failed to make file public" });
    }
  });

  blobStream.end(file.buffer);
};

export default uploadFile;
