import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Post from "@/models/Post";

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectMongo();

    if (id) {
      // Get single post by ID
      const post = await Post.findById(id);
      if (!post) {
        return jsonResponse({ success: false, message: "Post not found." }, 404);
      }
      return jsonResponse({ success: true, post });
    } else {
      // Get all posts
      const posts = await Post.find().sort({ createdAt: -1 });
      return jsonResponse({ success: true, posts });
    }
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return jsonResponse({ success: false, message: "Failed to load posts." }, 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;
    if (!title || !description) {
      return jsonResponse({ success: false, message: "Title and description are required." }, 400);
    }

    await connectMongo();

    const newPost = await Post.create({
      title: title.trim(),
      description: description.trim(),
      status: "Active"
    });

    return jsonResponse({ success: true, post: newPost }, 201);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return jsonResponse({ success: false, message: "Failed to create post." }, 500);
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !["Active", "Blocked"].includes(status)) {
      return jsonResponse({ success: false, message: "Invalid post id or status." }, 400);
    }

    await connectMongo();
    const updatedPost = await Post.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedPost) {
      return jsonResponse({ success: false, message: "Post not found." }, 404);
    }

    return jsonResponse({ success: true, post: updatedPost });
  } catch (error) {
    console.error("PATCH /api/posts error:", error);
    return jsonResponse({ success: false, message: "Failed to update post." }, 500);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description } = body;

    if (!id) {
      return jsonResponse({ success: false, message: "Post ID is required." }, 400);
    }

    if (!title || !description) {
      return jsonResponse({ success: false, message: "Title and description are required." }, 400);
    }

    await connectMongo();
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title: title.trim(), description: description.trim() },
      { new: true }
    );

    if (!updatedPost) {
      return jsonResponse({ success: false, message: "Post not found." }, 404);
    }

    return jsonResponse({ success: true, post: updatedPost });
  } catch (error) {
    console.error("PUT /api/posts error:", error);
    return jsonResponse({ success: false, message: "Failed to update post." }, 500);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonResponse({ success: false, message: "Post ID is required." }, 400);
    }

    await connectMongo();
    const deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      return jsonResponse({ success: false, message: "Post not found." }, 404);
    }

    return jsonResponse({ success: true, message: "Post deleted." });
  } catch (error) {
    console.error("DELETE /api/posts error:", error);
    return jsonResponse({ success: false, message: "Failed to delete post." }, 500);
  }
}
