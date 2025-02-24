import mongoose from "mongoose";

const codeExecutionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    output: String,
    error: String,
  },
  { timestamps: true }
);

const saveSnippets = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const star = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  snippetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SaveSnippets",
    required: true,
  },
});

const snippetComments = new mongoose.Schema(
  {
    snippetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaveSnippets",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName:{
      type:String,
      required:true
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const SnippetComments = mongoose.model(
  "SnippetComments",
  snippetComments
);
export const Star = mongoose.model("Star", star);
export const SaveSnippets = mongoose.model("SaveSnippets", saveSnippets);
export const CodeExecution = mongoose.model(
  "CodeExecution",
  codeExecutionSchema
);
