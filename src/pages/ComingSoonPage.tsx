
import { Link } from 'react-router-dom';
import { ConstructionIcon, ArrowLeftIcon } from 'lucide-react';

const ComingSoonPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-8">
                    <ConstructionIcon className="h-12 w-12 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Coming Soon</h1>
                <p className="text-lg text-gray-600 mb-8">
                    We're working hard to bring you this page. Please check back later!
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <ArrowLeftIcon className="mr-2 h-5 w-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ComingSoonPage;
