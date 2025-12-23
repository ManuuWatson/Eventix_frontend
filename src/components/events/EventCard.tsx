import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const FALLBACK_IMAGE_PATH = "/images/fallback-poster.png";

interface EventCardProps {
  event: {
    event_id: string;
    name: string;
    description: string;
    poster?: string;
    poster_url?: string;
    date: string;
    location: string;
    total_likes: number;
    liked_by_user?: boolean;
  };
  onLikeUpdate?: (event_id: string, likes_count: number) => void; // Callback to update parent
}

const EventCard: React.FC<EventCardProps> = ({ event, onLikeUpdate }) => {
  const {
    event_id,
    name,
    description,
    poster,
    poster_url,
    date,
    location,
    total_likes,
    liked_by_user,
  } = event;

  const { token } = useAuth();

  const [likeCount, setLikeCount] = useState<number>(total_likes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(
    liked_by_user || false
  );
  const [isLiking, setIsLiking] = useState(false);

  const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // Sync likes when event updates from parent
  useEffect(() => {
    setLikeCount(total_likes || 0);
    setIsLiked(
      liked_by_user || false
    );
  }, [total_likes, liked_by_user, event_id]);

  const handleLike = async () => {
    if (!token) {
      alert("You should login to like this event.");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const previousLikedStatus = isLiked;
    const previousLikeCount = likeCount;
    const newLikedStatus = !previousLikedStatus;

    // Optimistic UI update
    setIsLiked(newLikedStatus);
    setLikeCount((prev) => (newLikedStatus ? prev + 1 : prev - 1));

    try {
      const res = await axiosInstance.post(`/events/${event_id}/like/`);
      const data = res.data;

      setLikeCount(data.likes_count);

      if (data.status === "liked") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

      // Notify parent to sync events list
      onLikeUpdate?.(event_id, data.likes_count);
    } catch (err) {
      console.error("Error toggling like:", err);
      setIsLiked(previousLikedStatus);
      setLikeCount(previousLikeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/events/${event_id}`
      );
      alert("Event link copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const initialImageSrc =
    poster_url && poster_url.startsWith("http")
      ? poster_url
      : poster && poster.startsWith("http")
        ? poster
        : poster
          ? `${baseUrl}${poster.startsWith("/") ? poster : "/" + poster}`
          : FALLBACK_IMAGE_PATH;

  const [currentImageSrc, setCurrentImageSrc] = useState(initialImageSrc);
  const handleImageError = () => setCurrentImageSrc(FALLBACK_IMAGE_PATH);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto">
      {/* Poster */}
      <div className="relative w-full overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={currentImageSrc}
          alt={name}
          className="w-full max-h-80 mx-auto object-scale-down transition-transform duration-500 hover:scale-[1.03]"
          onError={handleImageError}
        />

        {/* Likes badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow flex items-center gap-1">
          <Heart
            className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
          />
          <span className="text-xs font-semibold text-gray-800">{likeCount}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {description || "No description provided."}
        </p>

        <div className="text-xs text-gray-500 flex justify-between mb-2">
          <span>
            <strong>Date:</strong> {new Date(date).toDateString().slice(0, 10)}
          </span>
          <span>
            <strong>Location:</strong> {location}
          </span>
        </div>

        <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 text-sm ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500 transition"
              }`}
          >
            <Heart className="h-4 w-4" />
            <span>{isLiked ? "Liked" : "Like"} ({likeCount})</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        <Link
          to={`/events/${event_id}`}
          className="mt-3 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-lg text-center hover:bg-indigo-700 transition"
        >
          Buy Ticket
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
