import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";
import axios from "axios";

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
    likes_count: number;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    event_id,
    name,
    description,
    poster,
    poster_url,
    date,
    location,
    likes_count: initialLikes,
  } = event;

  const [likeCount, setLikeCount] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const baseUrl =
    (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const initialImageSrc =
    poster_url && poster_url.startsWith("http")
      ? poster_url
      : poster && poster.startsWith("http")
      ? poster
      : poster
      ? `${baseUrl}${poster.startsWith("/") ? poster : "/" + poster}`
      : "https://via.placeholder.com/1200x800?text=Event+Poster";

  const [currentImageSrc, setCurrentImageSrc] = useState(initialImageSrc);

  const handleImageError = () => {
    if (currentImageSrc !== FALLBACK_IMAGE_PATH) {
      setCurrentImageSrc(FALLBACK_IMAGE_PATH);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      await axios.post(`${baseUrl}/api/events/${event_id}/like/`);
    } catch (error) {
      console.error("Error liking event:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/events/${event_id}`
      );
      alert("Event link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto">
      {/* Poster */}
      {/* Event Poster */}
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
      className={`h-4 w-4 ${
        isLiked ? "text-red-500 fill-red-500" : "text-gray-500"
      }`}
    />
    <span className="text-xs font-semibold text-gray-800">
      {likeCount}
    </span>
  </div>
</div>


      {/* Info */}
      <div className="p-3 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {description || "No description provided."}
        </p>

        {/* Date + Location */}
        <div className="text-xs text-gray-500 flex justify-between mb-2">
          <span>
            <strong>Date:</strong>{" "}
            {new Date(date).toDateString().slice(0, 10)}
          </span>
          <span>
            <strong>Location:</strong> {location}
          </span>
        </div>

        {/* Like / Share */}
        <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 text-sm ${
              isLiked
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500 transition"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Buy Ticket */}
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
