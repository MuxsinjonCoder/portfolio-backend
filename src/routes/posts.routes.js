import express from "express";
import {
  CreatePost,
  GetPostById,
  GetPostsList,
  GetPostsWithPageSize,
} from "../controlers/post.controler.js";

const router = express.Router();

/**
 * @swagger
 * /api/posts/create-post:
 *   post:
 *     summary: Create blog post
 *     tags: [Blog-posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *               - title
 *               - content
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               title:
 *                 type: string
 *                 example: My First Blog Post
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                     - value
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [text, code]
 *                       example: text
 *                     value:
 *                       type: string
 *                       example: This is a sample paragraph or code.
 *     responses:
 *       200:
 *         description: Post successfully created
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
 *                   example: Post created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict (duplicate title or data issue)
 *       500:
 *         description: Server error
 */
router.post("/create-post", CreatePost);

/**
 * @swagger
 * /api/posts/get-posts:
 *   get:
 *     summary: Get paginated blog posts
 *     tags: [Blog-posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         example: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         required: true
 *         example: 10
 *     responses:
 *       200:
 *         description: Posts fetched successfully
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
 *                   example: Posts got with page and size
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: A blog post object
 *       500:
 *         description: Server error
 */
router.get("/get-posts", GetPostsWithPageSize);

/**
 * @swagger
 * /api/posts/get-posts-list:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog-posts]
 *     responses:
 *       200:
 *         description: All posts fetched successfully
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
 *                   example: All posts fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: A blog post object
 *       500:
 *         description: Server error
 */
router.get("/get-posts-list", GetPostsList);

/**
 * @swagger
 * /api/posts/get-post/{id}:
 *   get:
 *     summary: Get a single blog post by ID
 *     tags: [Blog-posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog post ID
 *     responses:
 *       200:
 *         description: Blog post fetched successfully
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
 *                   example: Post fetched successfully
 *                 data:
 *                   type: object
 *                   description: A blog post object
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/get-post/:id", GetPostById);

export default router;
