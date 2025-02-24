import mongoose from "mongoose";
import {
  CodeExecution,
  SaveSnippets,
  SnippetComments,
  Star,
} from "../models/codeExecutions.model.js";
import { User } from "../models/user.model.js";
export const saveExecutions = async (req, res) => {
  const { language, code, output, error } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ sucess: false, message: "User not found" });
    }
    const saveCode = new CodeExecution({
      userId: user._id,
      code,
      language,
      output,
      error,
    });
    await saveCode.save();
    return res
      .status(201)
      .json({ sucess: true, message: "Execution saved successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Internal Server Error" });
  }
};
export const postSnippets = async (req, res) => {
  const { code, language, title } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not Found !" });
    }
    console.log(title);
    const saveSnippet = new SaveSnippets({
      userId: user._id,
      code,
      language,
      name: user.name,
      title: title,
    });
    await saveSnippet.save();
    return res
      .status(201)
      .json({ sucess: true, message: "Snippet saved successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getSnippets = async (req, res) => {
  try {
    const response = await SaveSnippets.find().sort({ _id: -1 });
    return res.status(200).json({ sucess: true, data: response });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const isSnippetStarred = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!snippetId) {
      return res
        .status(400)
        .json({ success: false, message: "Snippet ID is required" });
    }

    const star = await Star.findOne({ userId, snippetId });

    return res.status(200).json({ success: true, isStarred: !!star });
  } catch (error) {
    console.log("Error checking if snippet is starred:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const starCount = async (req, res) => {
  try {
    const { snippetId } = req.params;
    if (!snippetId) {
      return res
        .status(400)
        .json({ success: false, message: "Snippet ID is required" });
    }
    const count = await Star.countDocuments({ snippetId });
    return res.status(200).json({ success: true, starCount: count });
  } catch (error) {
    console.error("Error fetching snippet star count:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteSnippet = async (req, res) => {
  try {
    const { snippetId } = req.params;

    if (!snippetId || !mongoose.Types.ObjectId.isValid(snippetId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Snippet ID" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const snip = await SaveSnippets.findById(snippetId);
    if (!snip) {
      return res
        .status(404)
        .json({ success: false, message: "Snippet not found" });
    }
    if (snip.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this snippet",
        });
    }
    await SnippetComments.deleteMany({ snippetId });
    await Star.deleteMany({ snippetId });
    await SaveSnippets.deleteOne({ _id: snippetId });
    return res
      .status(200)
      .json({ success: true, message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const starSnippet = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const userID = req.userId;

    if (!userID) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found in request" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const existingStar = await Star.findOne({ snippetId, userId: userID });
    if (existingStar) {
      await Star.deleteOne({ _id: existingStar._id });
      return res
        .status(200)
        .json({ success: true, message: "Snippet unstarred successfully" });
    }

    await Star.create({ userId: userID, snippetId });
    return res
      .status(201)
      .json({ success: true, message: "Snippet starred successfully" });
  } catch (error) {
    console.error("Error starring snippet:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getSnippetById = async (req, res) => {
  try {
    const { snippetId } = req.params;
    if (!snippetId) {
      return res
        .status(400)
        .json({ success: false, message: "Snippet ID is required" });
    }
    const snippet = await SaveSnippets.findById(snippetId);
    if (!snippet) {
      return res
        .status(400)
        .json({ success: false, message: "Snippet not found" });
    }
    return res.status(201).json({ success: true, snippet: snippet });
  } catch (error) {
    console.error("Error fetching snippet: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
export const getComments = async (req, res) => {
  try {
    const { snippetId } = req.params;
    if (!snippetId) {
      return res
        .status(400)
        .json({ success: false, message: "Snippet ID is required" });
    }
    const comments = await SnippetComments.find({snippetId}).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, comments: comments });
  } catch (error) {
    console.error("Error fetching Comments: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
export const addComments = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { content } = req.body; 
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    const newComment = new SnippetComments({
      snippetId: snippetId,
      userId: user._id,
      userName: user.name,
      content: content, 
    });
    await newComment.save();
    res.status(200).json({ success: true, message: "Comment Added Successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const comment = await SnippetComments.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
    }

    await SnippetComments.findByIdAndDelete(commentId); // Corrected

    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getStarredSnippets = async (req, res) => {
  try {
    const userId = req.userId; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const stars = await Star.find({ userId });

    if (!stars.length) {
      return res.status(200).json({ success: true, data: [] });
    }
    const snippetIds = stars.map((star) => star.snippetId);
    const snippets = await SaveSnippets.find({ _id: { $in: snippetIds } });
    res.status(200).json({ success: true, data: snippets });
  } catch (error) {
    console.error("Error fetching starred snippets:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserExecutions = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = 1;
    const limit = 10 ;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const executions = await CodeExecution.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalExecutions = await CodeExecution.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: executions,
      pagination: {
        total: totalExecutions,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user executions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


