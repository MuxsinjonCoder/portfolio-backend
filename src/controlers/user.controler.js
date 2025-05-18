import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Register from "../models/user.models.js";
import { sendEmail } from "../utils/sendEmail.js";

const verificationCodes = new Map();

// registers
export const RegisterUser = async (req, res) => {
  try {
    const { fullName, email, password, deviceId } = req.body;

    if (!fullName || !email || !password || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const existUserEmail = await Register.findOne({ email });
    const existDeviceId = await Register.findOne({ deviceId });

    if (existUserEmail) {
      return res.status(409).json({
        success: false,
        message: "This email already exists",
      });
    }

    if (existDeviceId) {
      return res.status(409).json({
        success: false,
        message: "This deviceId already exists",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000;

    verificationCodes.set(email, {
      code,
      expiresAt,
      userData: { fullName, password, deviceId },
    });

    const verificationLink = `http://localhost:3000/verify-email?email=${email}&code=${code}`;
    await sendEmail(email, "Emailni tasdiqlash", verificationLink);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const VerifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and verification code",
      });
    }

    const record = verificationCodes.get(email);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No verification code found for this email",
      });
    }

    if (Date.now() > record.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    if (record.code !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    const { fullName, password, deviceId } = record.userData;

    const existUserEmail = await Register.findOne({ email });
    const existDeviceId = await Register.findOne({ deviceId });

    if (existUserEmail) {
      return res.status(409).json({
        success: false,
        message: "This email already exists",
      });
    }

    if (existDeviceId) {
      return res.status(409).json({
        success: false,
        message: "This deviceId already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Register({
      fullName,
      email,
      password: hashedPassword,
      deviceId,
    });

    await newUser.save();
    verificationCodes.delete(email);

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "168h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
        token,
        deviceId: newUser.deviceId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const ResendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const userExists = await Register.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already registered with this email",
      });
    }

    const record = verificationCodes.get(email);
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No pending verification for this email",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000;

    verificationCodes.set(email, {
      code,
      expiresAt,
      userData: record.userData,
    });

    const verificationLink = `http://localhost:3000/verify-email?email=${email}&code=${code}`;
    await sendEmail(email, "Emailni tasdiqlash", verificationLink);

    return res.status(200).json({
      success: true,
      message: "New verification code sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

// login
export const LoginUser = async (req, res) => {
  try {
    const { deviceId, email, password } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "Please provide deviceId",
      });
    }

    if (!password || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const checkedUser = await Register.findOne({ email });

    if (!checkedUser) {
      return (
        res.status(404),
        json({
          success: false,
          menubar: "User is not registrated",
        })
      );
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      checkedUser.password
    );

    if (!isPasswordMatched) {
      return res.status(403).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    if (checkedUser.deviceId !== deviceId) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 3 * 60 * 1000;

      verificationCodes.set(email, {
        code,
        expiresAt,
        userData: { deviceId },
      });

      await sendEmail(
        email,
        "Yangi qurilmadan kirish",
        `Kirishni tasdiqlash kodingiz: ${code}. Kod 3 daqiqa ichida amal qiladi.`
      );

      return res.status(202).json({
        success: true,
        message: "New device detected. Verification code sent to email",
      });
    }

    const token = jwt.sign(
      { userId: checkedUser._id },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "168h" }
    );

    return res.status(200).json({
      success: true,
      message: "User Logined",
      data: {
        fullName: checkedUser.fullName,
        email: checkedUser.email,
        token,
        deviceId: checkedUser.deviceId,
        createdAt: checkedUser.createdAt,
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const VerifyLoginEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and verification code",
      });
    }

    const record = verificationCodes.get(email);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No verification code found for this email",
      });
    }

    if (Date.now() > record.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    if (record.code !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    const { deviceId } = record.userData;
    const checkedUser = await Register.findOne({ email });

    verificationCodes.delete(email);

    const token = jwt.sign(
      { userId: checkedUser._id },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "168h" }
    );

    return res.status(201).json({
      success: true,
      message: "User confirmed",
      data: {
        fullName: checkedUser.fullName,
        email: checkedUser.email,
        deviceId,
        createdAt: checkedUser.createdAt,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const ForgotPassword = async (req, res) => {
  try {
    const { email, newPassword, deviceId } = req.body;

    if (!email || !newPassword || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const existUser = await Register.findOne({ email });

    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User with this email not found",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "168h" }
    );

    await Register.updateOne(
      { email },
      { $set: { password: newHashedPassword } }
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      token: token,
      data: {
        existUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
