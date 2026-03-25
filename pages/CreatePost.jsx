import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { X, Image as ImageIcon, Video, FileText, Calendar, Globe } from "lucide-react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        name: localStorage.getItem("user_name") || "User",
      });
    }
  }, []);

  const handlePost = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login first");
    if (!content.trim()) return;

    setLoading(true);
    const role = localStorage.getItem("user_role");
    const name = localStorage.getItem("user_name") || user.phoneNumber;

    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: name,
        userRole: role,
        content: content,
        timestamp: serverTimestamp()
      });
      navigate("/feed");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">

          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Create a post</h2>
            <button
              onClick={() => navigate("/feed")}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 flex gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0a66c2] flex items-center justify-center text-white font-bold shrink-0">
              {userData?.name?.[0]}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{userData?.name}</h4>
              <button className="flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-gray-500 text-gray-500 font-semibold text-xs mt-1 hover:bg-gray-100 transition-colors">
                <Globe className="w-3.5 h-3.5" /> Anyone
              </button>
            </div>
          </div>

          <div className="px-4">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full min-h-[250px] outline-none text-lg text-gray-700 resize-none border-none placeholder:text-gray-400 p-0"
            />
          </div>

          <div className="p-4 pt-10">
            <div className="flex items-center gap-2 text-gray-500">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <ImageIcon className="w-6 h-6 group-hover:text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <Video className="w-6 h-6 group-hover:text-green-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <Calendar className="w-6 h-6 group-hover:text-orange-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <FileText className="w-6 h-6 group-hover:text-gray-900" />
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handlePost}
                disabled={!content.trim() || loading}
                className="bg-[#0a66c2] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#004182] transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
