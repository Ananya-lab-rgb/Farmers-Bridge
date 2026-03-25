import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, auth } from "@/firebase";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Calendar,
  Newspaper,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send
} from "lucide-react";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().getTime() || Date.now()
        }));

        // Client-side sorting
        const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(sortedData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const user = auth.currentUser;
    if (user) {
      setUserData({
        name: localStorage.getItem("user_name") || "User",
        role: localStorage.getItem("user_role") || "Member",
        location: "Kamataka, India" // Mock location
      });
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Left Column: Profile Summary */}
        <div className="hidden md:block md:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-14 bg-[#a0b4b7]" />
            <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-white overflow-hidden mb-2 shadow">
                <div className="w-full h-full bg-[#0a66c2] flex items-center justify-center text-white text-2xl font-bold">
                  {userData?.name?.[0] || "?"}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-center hover:underline cursor-pointer">
                {userData?.name}
              </h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1)} at FarmerBridge
              </p>
            </div>
            <div className="border-t border-gray-100 p-3 space-y-1">
              <div className="flex justify-between text-xs font-semibold py-1">
                <span className="text-gray-500">Profile viewers</span>
                <span className="text-[#0a66c2]">42</span>
              </div>
              <div className="flex justify-between text-xs font-semibold py-1">
                <span className="text-gray-500">Post impressions</span>
                <span className="text-[#0a66c2]">1,204</span>
              </div>
            </div>
            <div className="border-t border-gray-100 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <p className="text-[11px] text-gray-500 font-semibold uppercase">My Items</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm sticky top-20">
            <p className="text-xs font-semibold text-gray-900 mb-3">Recent</p>
            <ul className="space-y-2 text-xs font-semibold text-gray-500">
              <li className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
                <span>#</span> agriculture
              </li>
              <li className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
                <span>#</span> organicfarming
              </li>
              <li className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
                <span>#</span> smartfarming
              </li>
            </ul>
          </div>
        </div>

        {/* Center Column: Feed */}
        <div className="md:col-span-6 space-y-4">

          {/* Create Post Box */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex gap-3 items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-[#0a66c2] flex items-center justify-center text-white font-bold shrink-0">
                {userData?.name?.[0]}
              </div>
              <button
                onClick={() => navigate("/create-post")}
                className="flex-1 text-left px-4 py-3 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-500 font-semibold transition-colors text-sm"
              >
                Start a post
              </button>
            </div>
            <div className="flex justify-between px-2">
              <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-gray-500 font-semibold text-sm">
                <ImageIcon className="text-[#378fe9] w-5 h-5" /> Media
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-gray-500 font-semibold text-sm">
                <Calendar className="text-[#c37d16] w-5 h-5" /> Event
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-gray-500 font-semibold text-sm">
                <Newspaper className="text-[#e06847] w-5 h-5" /> Write article
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-xs text-gray-500">Sort by: <span className="font-semibold text-gray-900 cursor-pointer hover:underline">Top</span></span>
          </div>

          {/* Post list */}
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 flex items-start justify-between">
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer"
                    onClick={() => navigate("/profile/" + post.userId)}
                  >
                    {post.userName?.[0]}
                  </div>
                  <div>
                    <h4
                      className="font-semibold text-sm text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigate("/profile/" + post.userId)}
                    >
                      {post.userName}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {post.userRole?.charAt(0).toUpperCase() + post.userRole?.slice(1)} • {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 pb-4 pt-1">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* LinkedIn Style Stats */}
              <div className="px-4 py-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</div>
                    <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center text-[8px] text-white">❤️</div>
                  </div>
                  <span>14</span>
                </div>
                <div>
                  <span className="hover:text-blue-600 hover:underline cursor-pointer">2 comments</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-gray-100 p-1 mx-2">
                <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition-colors">
                  <ThumbsUp className="w-5 h-5" /> Like
                </button>
                <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition-colors">
                  <MessageSquare className="w-5 h-5" /> Comment
                </button>
                <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition-colors">
                  <Share2 className="w-5 h-5" /> Repost
                </button>
                <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-gray-100 rounded text-gray-500 font-semibold text-sm transition-colors">
                  <Send className="w-5 h-5" /> Send
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Agro News */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">Farmer News</h3>
              <Newspaper className="w-4 h-4" />
            </div>
            <ul className="space-y-4">
              <li className="group cursor-pointer">
                <h5 className="text-[13px] font-semibold text-gray-900 group-hover:underline">New irrigation subsidies announced</h5>
                <p className="text-[11px] text-gray-500">Top news • 8,492 readers</p>
              </li>
              <li className="group cursor-pointer">
                <h5 className="text-[13px] font-semibold text-gray-900 group-hover:underline">Organic cotton prices set to rise</h5>
                <p className="text-[11px] text-gray-500">2h ago • 3,210 readers</p>
              </li>
              <li className="group cursor-pointer">
                <h5 className="text-[13px] font-semibold text-gray-900 group-hover:underline">Monsoon forecast: What farmers need to know</h5>
                <p className="text-[11px] text-gray-500">12h ago • 12,403 readers</p>
              </li>
            </ul>
            <button className="w-full mt-4 py-1 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded transition-colors">
              Show more
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-20 text-center">
            <p className="text-xs text-gray-500 mb-2 font-semibold">ADVERTISEMENT</p>
            <div className="bg-blue-50 p-4 rounded border border-blue-100">
              <p className="text-xs text-blue-800 font-bold mb-1">Upgrade your harvest</p>
              <p className="text-[10px] text-blue-600 mb-3">Get 20% off on all tractor rentals this season.</p>
              <button className="bg-[#0a66c2] text-white text-xs px-3 py-1.5 rounded-full font-bold">Try for free</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
