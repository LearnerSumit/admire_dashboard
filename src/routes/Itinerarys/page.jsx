const dummyItineraries = [
  {
    id: 1,
    title: "Explore Delhi Heritage",
    destination: "Delhi",
    duration: "3 Days / 2 Nights",
    pricing: "$499",
    thumbnail: "https://placehold.co/400x250?text=Delhi+Tour",
  },
  {
    id: 2,
    title: "Goa Beach Adventure",
    destination: "Goa",
    duration: "5 Days / 4 Nights",
    pricing: "$899",
    thumbnail: "https://placehold.co/400x250?text=Goa+Beach",
  },
  {
    id: 3,
    title: "Jaipur Royal Journey",
    destination: "Jaipur",
    duration: "4 Days / 3 Nights",
    pricing: "$699",
    thumbnail: "https://placehold.co/400x250?text=Jaipur+Trip",
  },
];

const ItineriesListPage = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
          All Itineraries
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dummyItineraries.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Destination: <span className="font-medium">{item.destination}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: <span className="font-medium">{item.duration}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Price: <span className="font-medium ">{item.pricing}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineriesListPage;
