import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AppContext from "../context/AppContext";

const socket = io("http://localhost:3000");

export default function HomePage() {
  const { user, posts, setPosts } = useContext(AppContext);
  const [newPost, setNewPost] = useState("");
  const [comment, setComment] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    socket.on("post", (post) => {
      setPosts((prevPosts) => [...prevPosts, post]);
    });

    socket.on("comment", (updatedPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    });

    socket.on("like", (updatedPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    });

    return () => {
      socket.off("post");
      socket.off("comment");
      socket.off("like");
    };
  }, [setPosts]);

  const handlePostSubmit = () => {
    const post = {
      id: Date.now(),
      username: user.username,
      content: newPost,
      comments: [],
      likes: 0,
    };
    socket.emit("post", post);
    setNewPost("");
  };

  const handleCommentSubmit = (postId) => {
    const updatedPost = posts.find((post) => post.id === postId);
    updatedPost.comments.push({ username: user.username, content: comment });
    setPosts([...posts]);
    socket.emit("comment", updatedPost);
    setComment("");
    setSelectedPost(null);
  };

  const handleLike = (postId) => {
    const updatedPost = posts.find((post) => post.id === postId);
    updatedPost.likes += 1;
    setPosts([...posts]);
    socket.emit("like", updatedPost);
  };

  return (
    <div className="px-40 py-10">
      <h1 className="text-center text-4xl mb-4">Welcome, {user.username}</h1>
      <div className="mb-4">
        <textarea
          className="px-4 py-2 mb-4 border border-black w-full"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 border border-black font-bold rounded-2xl"
            onClick={handlePostSubmit}
          >
            Post
          </button>
        </div>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="border border-black p-4 mb-4">
            <h3 className="font-semibold text-xl">{post.username}</h3>
            <p>{post.content}</p>
            <button className="mr-4" onClick={() => handleLike(post.id)}>
              Like ({post.likes})
            </button>
            <button onClick={() => setSelectedPost(post.id)}>Comment</button>
            {selectedPost === post.id && (
              <div>
                <textarea
                  className="px-4 py-2 my-4 border border-black w-full"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 border border-black font-bold rounded-2xl"
                    onClick={() => handleCommentSubmit(post.id)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            <div className="mt-3">
              {post.comments.map((comment, index) => (
                <p key={index}>
                  <strong>{comment.username}</strong>: {comment.content}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
