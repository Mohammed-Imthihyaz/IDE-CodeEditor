import express from "express";
import {
    addComments,
    deleteComment,
    deleteSnippet,
    getComments,
    getSnippetById,
    getSnippets,
    getStarredSnippets,
    getUserExecutions,
    isSnippetStarred,
    postSnippets,
    saveExecutions,
    starCount,
    starSnippet,
} from "../controllers/codeExecution.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/save-code", verifyToken, saveExecutions);
router.post("/post-snippets", verifyToken, postSnippets);
router.get("/get-snippets", getSnippets);
router.get("/is-starred/:snippetId", verifyToken, isSnippetStarred);
router.get("/get-StarCount/:snippetId", verifyToken, starCount);
router.delete("/delete-Snippet/:snippetId", verifyToken, deleteSnippet);
router.post("/Star/:snippetId", verifyToken, starSnippet);
router.get("/get-snippetById/:snippetId", getSnippetById);
router.get("/get-comments/:snippetId", getComments);
router.post("/add-comment/:snippetId", verifyToken, addComments);
router.delete("/delete-comment/:commentId", verifyToken,  deleteComment);
router.get("/get-starsnippets/", verifyToken,getStarredSnippets);
router.get("/user-executions/:userId",getUserExecutions);

export default router;
