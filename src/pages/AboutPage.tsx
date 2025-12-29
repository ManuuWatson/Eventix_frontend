
import { UsersIcon, HeartIcon, GlobeIcon, AwardIcon } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-900 opacity-90"></div>
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Connecting People Through <span className="text-pink-400">Experiences</span>
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
                        EventTix is the premier platform for discovering, hosting, and managing events.
                        We believe in the power of gathering to inspire, educate, and entertain.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Mission</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        To empower event organizers and delight attendees with seamless technology,
                        making every event memorable and accessible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
                        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UsersIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Community First</h3>
                        <p className="text-gray-600">Building strong local and global communities through shared interests.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
                        <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HeartIcon className="h-8 w-8 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Passion Driven</h3>
                        <p className="text-gray-600">Fueled by a love for bringing people together for meaningful moments.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <GlobeIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
                        <p className="text-gray-600">Connecting hosts and attendees across cities, countries, and continents.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AwardIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                        <p className="text-gray-600">Commited to providing the best user experience for organizers and guests.</p>
                    </div>
                </div>
            </section>


            {/* Story Section */}
            <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

                    {/* Image */}
                    <div className="md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/carousel/event_backgroundimg1.jpg"
                                alt="Our story at EventTix"
                                className="w-full h-80 object-cover"
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Our Story
                        </h2>

                        <p className="text-lg text-gray-600 mb-4">
                            Founded in 2024, EventTix started with a simple idea: event ticketing
                            shouldn't be complicated or expensive. We noticed that organizers
                            were struggling with clunky interfaces and high fees.
                        </p>

                        <p className="text-lg text-gray-600 mb-6">
                            We set out to change that by building a platform that puts user
                            experience first. Today, we're proud to support thousands of events,
                            from intimate workshops to large-scale festivals.
                        </p>

                        <div className="flex gap-6">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-indigo-600">10k+</span>
                                <span className="text-sm text-gray-500">Events Hosted</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-indigo-600">50k+</span>
                                <span className="text-sm text-gray-500">Tickets Sold</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-indigo-600">99%</span>
                                <span className="text-sm text-gray-500">Satisfaction</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default AboutPage;
