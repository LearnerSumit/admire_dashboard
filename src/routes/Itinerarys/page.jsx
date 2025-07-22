import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Calendar, Plus, List, ArrowRight, Search, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router-dom

// --- UPDATED DUMMY DATA ---
const dummyItineraries = [
  {
    id: 1,
    title: "Heritage Tour of Delhi",
    destination: "Delhi",
    duration: "3 Days / 2 Nights",
    thumbnail: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1974&auto=format&fit=crop",
    type: "Domestic",
    status: "published"
  },
  {
    id: 2,
    title: "Goa's Sun-Kissed Beaches",
    destination: "Goa",
    duration: "5 Days / 4 Nights",
    thumbnail: "https://images.unsplash.com/photo-1590372729391-692134503b55?q=80&w=2070&auto=format&fit=crop",
    type: "Domestic",
    status: "published"
  },
  {
    id: 3,
    title: "The Royal Roads of Jaipur",
    destination: "Jaipur",
    duration: "4 Days / 3 Nights",
    thumbnail: "https://images.unsplash.com/photo-1603262110263-fb0112e797e1?q=80&w=2070&auto=format&fit=crop",
    type: "Domestic",
    status: "private"
  },
  {
    id: 4,
    title: "Parisian Dreams",
    destination: "Paris",
    duration: "6 Days / 5 Nights",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=2070&auto=format&fit=crop",
    type: "International",
    status: "published"
  },
];

// --- UPGRADED ItineraryCard COMPONENT ---
const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="overflow-hidden relative">
        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(itinerary.id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(itinerary.id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-900 transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <img
          src={itinerary.thumbnail}
          alt={`Thumbnail for ${itinerary.title}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-2">
          {itinerary.title}
        </h3>
        <div className="space-y-2.5 text-sm">
          <p className="flex items-center text-slate-600 dark:text-slate-400">
            <MapPin size={14} className="mr-2 text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200">{itinerary.destination}</span>
          </p>
          <p className="flex items-center text-slate-600 dark:text-slate-400">
            <Calendar size={14} className="mr-2 text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200">{itinerary.duration}</span>
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${itinerary.status === 'published'
              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400"
            }`}>
            {itinerary.status}
          </span>
          <a href="#" className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View Details
            <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

// --- UPGRADED ItinerariesListPage COMPONENT ---
const ItinerariesListPage = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ type: "all", status: "all",destination: "all" });

  useEffect(() => {
    setTimeout(() => {
      setItineraries(dummyItineraries);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredItineraries = useMemo(() => {
    return itineraries
      .filter(it => { // Search filter
        const query = searchQuery.toLowerCase();
        return it.title.toLowerCase().includes(query) || it.destination.toLowerCase().includes(query);
      })
      .filter(it => { // Type filter
        return filters.type === 'all' || it.type === filters.type;
      })
      .filter(it => { // Status filter
        return filters.status === 'all' || it.status === filters.status;
      }).filter(it => { // Places filter
        return filters.destination === 'all' || it.destination.includes(filters.destination);
      });

  }, [searchQuery, filters, itineraries]);

  const handleEdit = (id) => console.log("Edit itinerary", id);
  const handleDelete = (id) => {
    console.log("Delete itinerary", id);
    setItineraries(prev => prev.filter(it => it.id !== id));
  };

  const inputStyle =
    "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
  const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"


  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <List size={28} className="mr-3 text-blue-500" />
              All Itineraries
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Browse, manage, and create new travel packages.
            </p>
          </div>
          <button
            onClick={() => navigate("/create_itinerary")} // Link to your "create new" page
            className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-slate-900"
          >
            <Plus size={16} />
            Create New Itinerary
          </button>
        </div>

        {/* Filter and Search Controls */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex w-full md:w-auto items-center gap-4">
            <select name="type" value={filters.type} onChange={handleFilterChange} className={`${inputStyle} w-auto`}>
              <option value="all">-- Types --</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className={`${inputStyle} w-auto`}>
              <option value="all">-- Status --</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
            </select>
            <select name="destination" value={filters.place} onChange={handleFilterChange} className={`${inputStyle} w-auto`}>
              <option value="all">-- Destination --</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
            </select>
          </div>
        </div>

        {/* Itinerary Grid */}
        {isLoading ? (
          // --- Loading Skeleton ---
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-pulse">
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                <div className="mt-4 h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredItineraries.length === 0 ? (
          // --- No Itineraries Found ---
          <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Itineraries Match Your Criteria</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          // --- Display Itineraries ---
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItineraries.map((item) => (
              <ItineraryCard key={item.id} itinerary={item} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItinerariesListPage;