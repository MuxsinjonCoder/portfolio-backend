import express from "express";
import {
  ForgotPassword,
  LoginUser,
  RegisterUser,
  ResendCode,
  VerifyEmail,
  VerifyLoginEmail,
} from "../controlers/user.controler.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Request email verification code to register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - deviceId
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: userName
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 example: example-password
 *               deviceId:
 *                 type: string
 *                 example: device-123456
 *     responses:
 *       200:
 *         description: Verification code sent to email
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
 *                   example: Verification code sent to email
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict (email or deviceId exists)
 *       500:
 *         description: Server error
 */
router.post("/register", RegisterUser);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email with code and complete registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               verificationCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: userName
 *                     email:
 *                       type: string
 *                       example: example@gmail.com
 *                     deviceId:
 *                       type: string
 *                       example: device-123456
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request or invalid code
 *       409:
 *         description: Conflict (email or deviceId exists)
 *       500:
 *         description: Server error
 */
router.post("/verify-email", VerifyEmail);

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Resend verification code to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *     responses:
 *       200:
 *         description: New verification code sent to email
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
 *                   example: New verification code sent to email
 *       400:
 *         description: Bad request (missing email or no pending verification)
 *       409:
 *         description: User already registered with this email
 *       500:
 *         description: Server error
 */
router.post("/resend-code", ResendCode);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - deviceId
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 example: string
 *               deviceId:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: User logined
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
 *                   example: User logined
 *       400:
 *         description: Bad request (missing email or no pending verification)
 *       500:
 *         description: Server error
 */
router.post("/login", LoginUser);

/**
 * @swagger
 * /api/auth/verify-login-email:
 *   post:
 *     summary: Verify email for logined email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               verificationCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User logined successfully
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
 *                   example: User logined successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: userName
 *                     email:
 *                       type: string
 *                       example: example@gmail.com
 *                     deviceId:
 *                       type: string
 *                       example: device-123456
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request or invalid code
 *       409:
 *         description: Conflict (email or deviceId exists)
 *       500:
 *         description: Server error
 */
router.post("/verify-login-email", VerifyLoginEmail);

/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     summary: Update password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - deviceId
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 example: string
 *               deviceId:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: Password updated
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
 *                   example: Password updated
 *       400:
 *         description: Bad request (missing email or no pending verification)
 *       500:
 *         description: Server error
 */
router.post("/update-password", ForgotPassword);

export default router;
