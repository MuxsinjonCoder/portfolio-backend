import Posts from "../models/posts.models.js";

export const CreatePost = async (req, res) => {
  try {
    const { imageUrl, title, content, tags, lang } = req.body;

    if (!imageUrl || !title || !content || !lang || !tags) {
      return res.status(400).json({
        success: false,
        messsage: "Please porvide imageUrl, title and content[{}]",
      });
    }

    const newPost = Posts({
      imageUrl,
      title,
      content,
      tags,
      lang,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      messsage: "New post added",
      data: {
        imageUrl: newPost.imageUrl,
        title: newPost.title,
        content: newPost.content,
      },
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const GetPostsWithPageSize = async (req, res) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  const skip = (page - 1) * size;

  try {
    const totalItems = await Posts.countDocuments();
    const data = await Posts.find().skip(skip).limit(size);

    res.json({
      success: true,
      message: "Posts got with page and size",
      data: {
        elements: data.length,
        page,
        size,
        totalItems,
        totalPages: Math.ceil(totalItems / size),
        data,
      },
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const GetPostsList = async (req, res) => {
  try {
    const posts = await Posts.find();

    return res.status(200).json({
      success: true,
      message: "All posts got successfully",
      data: {
        elements: posts.length,
        posts,
      },
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const GetPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
