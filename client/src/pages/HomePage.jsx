import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { GoComment, GoDotFill } from "react-icons/go";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

const socket = io("http://localhost:3000");

export default function HomePage() {
  const { user, setUser, posts, setPosts } = useContext(AppContext);
  const [newPost, setNewPost] = useState("");
  const [comment, setComment] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [userOnline, setUserOnline] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setUser({ username: localStorage.username });
    socket.auth = {
      username: localStorage.username,
    };
    socket.disconnect().connect();
  }, []);

  useEffect(() => {
    socket.on("posts", (posts) => {
      setPosts(posts);
    });

    // socket.on("post", (post) => {
    //   setPosts((prevPosts) => [...prevPosts, post]);
    // });

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

    socket.on("users", (newUsers) => {
      setUserOnline(newUsers);
    });

    return () => {
      socket.off("posts");
      socket.off("post");
      socket.off("comment");
      socket.off("like");
      socket.off("users");
    };
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();
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
    const isLiked = likedPosts.includes(postId);

    if (!isLiked) {
      updatedPost.likes += 1;
      setLikedPosts([...likedPosts, postId]);
    } else {
      updatedPost.likes -= 1;
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    }
    setPosts([...posts]);
    socket.emit("like", updatedPost);
  };

  console.log(userOnline);

  return (
    <div className="flex min-h-screen">
      <div className="p-5 bg-primary text-white">
        <h1 className="text-3xl mb-4">Users Online</h1>
        {userOnline?.map((u) => (
          <div key={u.id} className="flex items-center">
            <GoDotFill color="blue" />
            <h1 key={u.id} className="text-xl">
              {u.username}
            </h1>
          </div>
        ))}
      </div>
      <div className="flex-1 p-5">
        <div className="text-end">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
        <h1 className="text-center text-4xl mb-4">
          Welcome,{" "}
          <span className="text-primary font-bold">{user.username}</span>
        </h1>
        <div className="mb-4">
          <form onSubmit={handlePostSubmit}>
            <textarea
              required
              className="resize-none px-4 py-2 mb-4 border border-primary rounded-lg w-full"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border bg-primary text-white border-primary rounded-lg font-bold "
              >
                Post
              </button>
            </div>
          </form>
        </div>
        <div>
          {posts?.map((post) => (
            <div
              key={post.id}
              className="border border-primary rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold text-xl">{post.username}</h3>
              <p>{post.content}</p>
              <div className="flex">
                <button
                  className="mr-4 flex items-center gap-2"
                  onClick={() => handleLike(post.id)}
                >
                  {likedPosts.includes(post.id) ? (
                    <FcLike />
                  ) : (
                    <FcLikePlaceholder />
                  )}
                  {post.likes}
                </button>
                <button
                  className="flex items-center gap-2"
                  onClick={() => setSelectedPost(post.id)}
                >
                  <GoComment /> {post.comments.length}
                </button>
              </div>

              {selectedPost === post.id && (
                <div>
                  <textarea
                    className="px-4 py-2 my-4 border border-primary rounded-lg w-full"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                  />
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 border bg-primary text-white border-primary font-bold rounded-lg"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-3">
                {post.comments?.map((comment, index) => (
                  <p key={index}>
                    <strong>{comment.username}</strong>: {comment.content}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
