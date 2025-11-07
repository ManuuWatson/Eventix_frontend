// EventCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";
import axios from "axios";

// Local fallback image in your public directory
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
    category?: string;
    ticket_types: {
      id: string;
      name: string;
      price: number;
    }[];
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

  // Base API URL
  const baseUrl =
    (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // ✅ Use poster_url first (from backend JSON), fallback to poster, then placeholder
  const initialImageSrc =
    poster_url && poster_url.startsWith("http")
      ? poster_url
      : poster && poster.startsWith("http")
      ? poster
      : poster
      ? `${baseUrl}${poster.startsWith("/") ? poster : "/" + poster}`
      : "https://via.placeholder.com/1200x800?text=Event+Poster";

  const [currentImageSrc, setCurrentImageSrc] = useState(initialImageSrc);

  // ✅ Handle image load failure gracefully
  const handleImageError = () => {
    if (currentImageSrc !== FALLBACK_IMAGE_PATH) {
      setCurrentImageSrc(FALLBACK_IMAGE_PATH);
    }
  };

  // ✅ Handle Like
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

  // ✅ Handle Share
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Event Poster */}
      <div className="relative w-full aspect-video">
        <img
          src={currentImageSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {/* Likes badge */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg flex items-center justify-center">
          <Heart
            className={`h-5 w-5 ${
              isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
          <span className="text-sm font-bold text-gray-800 ml-1">
            {likeCount}
          </span>
        </div>
      </div>

      {/* Event Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-3">
          {description || "No description provided."}
        </p>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="text-gray-500 text-sm flex justify-between flex-wrap gap-2">
            <span>
              <strong>Date:</strong> {new Date(date).toDateString()}
            </span>
            <span>
              <strong>Location:</strong> {location}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-around items-center pt-4 border-t border-gray-100 mt-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex flex-col items-center p-2 rounded-md transition-colors ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            aria-pressed={isLiked}
          >
            <Heart className="h-6 w-6" />
            <span className="text-sm font-medium mt-1">
              {isLiked ? "Liked" : "Like"}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center text-gray-500 hover:text-indigo-600 p-2 rounded-md transition-colors"
          >
            <Share2 className="h-6 w-6" />
            <span className="text-sm font-medium mt-1">Share</span>
          </button>
        </div>

        {/* Buy Ticket */}
        <Link
          to={`/events/${event_id}`}
          className="mt-4 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg text-center shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Buy Ticket
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
