import { useEffect, useState } from "react";
import { MapPin, Calendar, DollarSign, Plus, List, ArrowRight } from "lucide-react";

// --- DUMMY DATA (for demonstration) ---
const dummyItineraries = [
  {
    id: 1,
    title: "Heritage Tour of Delhi",
    destination: "Delhi",
    duration: "3 Days / 2 Nights",
    pricing: "499",
    thumbnail: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Goa's Sun-Kissed Beaches",
    destination: "Goa",
    duration: "5 Days / 4 Nights",
    pricing: "899",
    thumbnail: "https://images.unsplash.com/photo-1590372729391-692134503b55?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "The Royal Roads of Jaipur",
    destination: "Jaipur",
    duration: "4 Days / 3 Nights",
    pricing: "699",
    thumbnail: "https://images.unsplash.com/photo-1603262110263-fb0112e797e1?q=80&w=2070&auto=format&fit=crop",
  },
   {
    id: 4,
    title: "Mystical Varanasi Ghats",
    destination: "Varanasi",
    duration: "2 Days / 1 Night",
    pricing: "350",
    thumbnail: "https://images.unsplash.com/photo-1561361523-9a3d5c58a8a4?q=80&w=2070&auto=format&fit=crop",
  },
];

// --- REDESIGNED ItineraryCard COMPONENT ---
const ItineraryCard = ({ itinerary }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="overflow-hidden">
        <img
          src={itinerary.thumbnail}
          alt={`Thumbnail for ${itinerary.title}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-3">
          {itinerary.title}
        </h3>
        <div className="space-y-3 text-sm">
          <p className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={14} className="mr-2 text-gray-500" />
            <span className="font-medium text-gray-800 dark:text-gray-200">{itinerary.destination}</span>
          </p>
          <p className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar size={14} className="mr-2 text-gray-500" />
            <span className="font-medium text-gray-800 dark:text-gray-200">{itinerary.duration}</span>
          </p>
          <p className="flex items-center text-gray-600 dark:text-gray-400">
            <DollarSign size={14} className="mr-2 text-gray-500" />
            Starting from <span className="font-semibold text-blue-600 dark:text-blue-400 ml-1">${itinerary.pricing}</span>
          </p>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
           <a href="#" className="inline-flex items-center justify-center w-full text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
             View Details
             <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
           </a>
        </div>
      </div>
    </div>
  );
};


// --- REDESIGNED ItinerariesListPage COMPONENT ---
const ItinerariesListPage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItineraries(dummyItineraries);
      setIsLoading(false);
    }, 1500); // 1.5 second delay for loading simulation
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <List size={28} className="mr-3 text-blue-500" />
              All Itineraries
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Browse, manage, and create new travel packages.
            </p>
          </div>
          <a
            href="#" // Link to your "create new" page
            className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
          >
            <Plus size={16} />
            Create New Itinerary
          </a>
        </div>


        {/* Itinerary Grid */}
        {isLoading ? (
          // Loading Skeleton
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="mt-4 h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : itineraries.length === 0 ? (
          // No Itineraries Found
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
             <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Itineraries Found</h3>
             <p className="text-gray-500 mt-2">Get started by creating a new itinerary.</p>
          </div>
        ) : (
          // Display Itineraries
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itineraries.map((item) => (
              <ItineraryCard key={item.id} itinerary={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItinerariesListPage;