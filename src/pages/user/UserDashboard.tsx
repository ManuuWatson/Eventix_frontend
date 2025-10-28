import React from "react";
import { Link } from "react-router-dom";

const UserDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="mb-4 text-gray-600">
        Here’s a summary of your activities and upcoming events.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">Upcoming Events</h2>
          <p>See all your booked events and tickets.</p>
          <Link to="/events" className="text-indigo-600 hover:underline">
            View Events →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">Profile Settings</h2>
          <p>Update your profile or account details.</p>
          <Link to="/profile" className="text-indigo-600 hover:underline">
            Edit Profile →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">Tickets</h2>
          <p>View all your purchased tickets.</p>
          <Link to="/tickets" className="text-indigo-600 hover:underline">
            View Tickets →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
