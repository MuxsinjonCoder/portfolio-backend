// upload.route.js
import express from "express";
import uploadFile from "../controlers/upload.controler.js";
import multer from "multer";

const router = express.Router();

const anyUpload = multer().any();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 url:
 *                   type: string
 *                   example: https://example.com/uploads/image.jpg
 *       400:
 *         description: Bad request (e.g., no file provided or upload error)
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  (req, res, next) => {
    anyUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload error" });
      }

      if (req.files && req.files.length > 0) {
        req.file = req.files[0];
        next();
      } else {
        res.status(400).json({ error: "No file uploaded" });
      }
    });
  },
  uploadFile
);

export default router;
