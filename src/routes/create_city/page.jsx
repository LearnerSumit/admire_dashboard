import { useEffect, useState } from "react";
import { usePlaceStore } from "../../stores/usePlaceStore";

// An array of available categories. This could also be fetched from an API.
const AVAILABLE_CATEGORIES = ["Trending", "Exclusive", "Popular", "New"];

// Mock API functions for demonstration. Replace these with your actual API calls.
const fetchCitiesByState = async (stateId) => {
  console.log(`Fetching cities for state ID: ${stateId}`);
  // In a real app, this would be an API call, e.g., fetch(`/api/cities?stateId=${stateId}`)
  // Returning mock data for the example.
  if (stateId === "state-1-id") {
    return [
      { _id: "city-1-id", city_name: "Los Angeles" },
      { _id: "city-2-id", city_name: "San Francisco" },
    ];
  }
  return [];
};

const fetchCityDetails = async (cityId) => {
  console.log(`Fetching details for city ID: ${cityId}`);
  // In a real app, this would be, e.g., fetch(`/api/cities/${cityId}`)
  // Returning mock data for the example.
  if (cityId === "city-1-id") {
    return {
      _id: "city-1-id",
      cityName: "Los Angeles",
      categories: ["Popular", "Exclusive"],
      visibility: "public",
    };
  }
  return null;
};


const CreateCity = () => {
  // --- Component State Management ---

  // State for the top-level selection (Domestic/International)
  const [travelType, setTravelType] = useState("domestic");

  // State for the selected STATE ID from the first dropdown
  const [selectedState, setSelectedState] = useState("");
  
  // State for the list of cities fetched based on the selected state
  const [cityList, setCityList] = useState([]);
  const [isCityListLoading, setIsCityListLoading] = useState(false);

  // State for the selected CITY ID from the second dropdown
  const [selectedCityId, setSelectedCityId] = useState("");

  // --- Form Input States ---
  const [cityName, setCityName] = useState("");
  const [categories, setCategories] = useState([]);
  const [visibility, setVisibility] = useState("public");
  
  // Determine if the form is in "update" mode
  const isUpdateMode = !!selectedCityId;

  // --- Get state and actions from the Zustand store for fetching states ---
  const {
    destinationList: stateList, // Renaming for clarity
    isListLoading: isStateListLoading,
    fetchDestinationList: fetchStateList
  } = usePlaceStore();


  // --- Helper function to reset form fields ---
  const resetFormFields = () => {
    setCityName("");
    setCategories([]);
    setVisibility("public");
  };

  // --- Event Handlers ---

  // Handles changes to the travel type radio buttons
  const handleTypeChange = (e) => {
    setTravelType(e.target.value);
    setSelectedState("");
    setSelectedCityId("");
    setCityList([]);
    resetFormFields();
  };

  // Handles changes to the state dropdown
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCityId(""); // Reset city selection
    setCityList([]);      // Clear previous city list
    resetFormFields();     // Reset the form
  };

  // Handles changes to the city dropdown
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCityId(cityId);
    if (!cityId) {
      // If user selects "-- Select a City --", reset the form to create mode
      resetFormFields();
    }
  };

  // Handles changes for the category checkboxes
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategories(prev => checked ? [...prev, value] : prev.filter(c => c !== value));
  };


  // --- Data Fetching Effects ---

  // Effect to fetch the list of STATES (destinations) when travelType changes
  useEffect(() => {
    fetchStateList(travelType);
  }, [travelType, fetchStateList]);
  
  // Effect to fetch the list of CITIES when a STATE is selected
  useEffect(() => {
    if (!selectedState) {
      setCityList([]);
      return;
    }
    const getCities = async () => {
      setIsCityListLoading(true);
      try {
        const cities = await fetchCitiesByState(selectedState);
        setCityList(cities);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setCityList([]); // Reset on error
      } finally {
        setIsCityListLoading(false);
      }
    };
    getCities();
  }, [selectedState]);

  // Effect to fetch the details of a CITY when it's selected from the dropdown
  useEffect(() => {
    if (!selectedCityId) {
      resetFormFields();
      return;
    }
    const getCityDetails = async () => {
      // In a real app, you might want a loading state for the form itself
      const details = await fetchCityDetails(selectedCityId);
      if (details) {
        // Populate the form with the fetched data
        setCityName(details.cityName);
        setCategories(details.categories);
        setVisibility(details.visibility);
      }
    };
    getCityDetails();
  }, [selectedCityId]);


  // --- API Integration (Create/Update Logic) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!cityName) {
      alert("Please enter a city name.");
      return;
    }

    const cityDataPayload = { cityName, categories, visibility };

    if (isUpdateMode) {
      // --- UPDATE LOGIC ---
      console.log("UPDATING city:", selectedCityId, "with data:", cityDataPayload);
      alert(`City with ID ${selectedCityId} updated successfully!`);
    } else {
      // --- CREATE LOGIC ---
      const newCityData = { ...cityDataPayload, parentStateId: selectedState };
      console.log("CREATING new city in state:", selectedState, "with data:", newCityData);
      // Example: await fetch('/api/cities', { method: 'POST', body: JSON.stringify(newCityData) });
      alert(`New city created successfully in state ${selectedState}!`);
      // Optionally reset form after creation
      resetFormFields();
    }
  };


  return (
    <div className="flex flex-col gap-y-8 p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          City Management
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {isUpdateMode ? `Editing city: ${cityName}` : "Create a new city by selecting a state."}
        </p>
      </div>

      {/* Destination & City Selection Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Travel Type Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Travel Type</label>
            <div className="flex gap-6">
              {["domestic", "international"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={type} checked={travelType === type} onChange={handleTypeChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-transparent"/>
                  <span className="capitalize text-slate-800 dark:text-slate-200">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* State Dropdown */}
          <div>
            <label htmlFor="stateSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select State</label>
            <select id="stateSelect" value={selectedState} onChange={handleStateChange} className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50" disabled={isStateListLoading}>
              <option value="">{isStateListLoading ? "Loading States..." : "-- Select a State --"}</option>
              {stateList.map((state) => <option key={state._id} value={state._id}>{state.destination_name}</option>)}
            </select>
          </div>

          {/* City Dropdown */}
          <div>
            <label htmlFor="citySelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select City (Optional)</label>
            <select id="citySelect" value={selectedCityId} onChange={handleCityChange} className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50" disabled={!selectedState || isCityListLoading}>
              <option value="">{isCityListLoading ? "Loading Cities..." : "-- Select a City to Edit --"}</option>
              {cityList.map((city) => <option key={city._id} value={city._id}>{city.city_name}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* City Create/Update Form Card */}
      <form onSubmit={handleFormSubmit}>
        <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${!selectedState ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Left Column: Main Inputs */}
            <div className="flex flex-col gap-y-6">
              <div>
                <label htmlFor="cityName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City Name</label>
                <input type="text" id="cityName" value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder="e.g., Paris" className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"/>
              </div>
              <div>
                <label htmlFor="visibilitySelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Visibility</label>
                <select id="visibilitySelect" value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* Right Column: Vertical Categories */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</label>
              <div className="flex flex-col space-y-3">
                 {AVAILABLE_CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" value={category} checked={categories.includes(category)} onChange={handleCategoryChange} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-transparent"/>
                      <span className="text-slate-800 dark:text-slate-200">{category}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

           {/* Form Submission Button */}
           <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-end">
              <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900" disabled={!selectedState || !cityName}>
                {isUpdateMode ? 'Update City' : 'Create City'}
              </button>
            </div>
        </div>
      </form>
    </div>
  )
}

export default CreateCity;