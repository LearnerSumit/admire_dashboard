import { useEffect, useState } from "react";
import { usePlaceStore } from "../../stores/usePlaceStore";
import { AppleIcon, UploadCloud, X } from "lucide-react";
import { apiClient } from "../../stores/authStore";
import { toast } from "react-toastify";

// An array of available categories. This could also be fetched from an API.
const AVAILABLE_CATEGORIES = ["Trending", "Exclusive", "Popular", "New"];

// --- Mock API Functions ---
// NOTE: These are for demonstration. Replace with your actual API calls.

const fetchCitiesByState = async (stateId) => {
  console.log(`Fetching cities for state ID: ${stateId}`);
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
  if (cityId === "city-1-id") {
    return {
      _id: "city-1-id",
      cityName: "Los Angeles",
      categories: ["Popular", "Exclusive"],
      visibility: "public",
      // Add mock image URLs for an existing city
      images: [
        "https://images.unsplash.com/photo-1542300058-e093a2399985?w=400",
        "https://images.unsplash.com/photo-1572171552954-4e372e9dc7a7?w=400",
      ],
    };
  }
  return null;
};


const CreateCity = () => {
  // --- Component State Management ---
  const [travelType, setTravelType] = useState("domestic");
  const [selectedState, setSelectedState] = useState("");
  const [cityList, setCityList] = useState([]);
  const [isCityListLoading, setIsCityListLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("");


  // --- Form Input States ---
  const [cityName, setCityName] = useState("");
  const [categories, setCategories] = useState([]);
  const [visibility, setVisibility] = useState("public");

  console.log("Selected City category:", categories);

  
  // State for new image files to be uploaded
  const [newImageFiles, setNewImageFiles] = useState([]);
  // State for existing image URLs from a fetched city
  const [existingImages, setExistingImages] = useState([]);

  // Determine if the form is in "update" mode
  const isUpdateMode = !!selectedCityId;

  // Zustand store integration
  const {
    destinationList: stateList,
    isListLoading: isStateListLoading,
    fetchDestinationList: fetchStateList
  } = usePlaceStore();

  // --- Helper function to reset form fields ---
  const resetFormFields = () => {
    setCityName("");
    setCategories([]);
    setVisibility("public");
    setNewImageFiles([]); // Clear new images
    setExistingImages([]); // Clear existing image URLs
  };

  // --- Event Handlers ---
  const handleTypeChange = (e) => {
    setTravelType(e.target.value);
    setSelectedState("");
    setSelectedCityId("");
    setCityList([]);
    resetFormFields();
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCityId("");
    setCityList([]);
    resetFormFields();
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCityId(cityId);
    if (!cityId) {
      resetFormFields();
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategories(prev => checked ? [...prev, value] : prev.filter(c => c !== value));
  };
  
  // Handles selection of new image files
  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...files]);
      e.target.value = null; // Reset input to allow re-selecting same file
    }
  };

  // Removes a newly selected image from the preview
  const handleRemoveNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Removes an existing image (marks it for deletion on update)
  const handleRemoveExistingImage = (url) => {
    setExistingImages(prev => prev.filter(imgUrl => imgUrl !== url));
  };


  // --- Data Fetching Effects ---
  useEffect(() => {
    fetchStateList(travelType);
  }, [travelType, fetchStateList]);

  useEffect(() => {
    if (!selectedState) {
      setCityList([]);
      return;
    }
    const getCities = async () => {
      setIsCityListLoading(true);
      try {
        const cities = await apiClient.get(`/admin/state/${selectedState}`);
        // console.log("Fetched cities:", cities);
        setCityList(cities.data.citiesData || []);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setCityList([]);
      } finally {
        setIsCityListLoading(false);
      }
    };
    getCities();
  }, [selectedState]);

  useEffect(() => {
    if (!selectedCityId) {
      resetFormFields();
      return;
    }
    const getCityDetails = async () => {
      const details = await apiClient.get(`/admin/city/${selectedCityId}`);
      console.log("Fetched city details:", details);
      if (details.data.cityData) {
        setCityName(details.data.cityData.city_name);
        setCategories(details.data.cityData.city_category);
        setVisibility(details.data.cityData.visibility);
        setExistingImages(details.data.cityData.city_image || []); // Populate existing images
        setNewImageFiles([]); // Clear any staged new images
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

    // Use FormData for multipart/form-data, required for file uploads
    const formData = new FormData();
    formData.append("city_name", cityName);
    formData.append("visibility", visibility);
    formData.append("city_category", JSON.stringify(categories)); // Send array as JSON string
    
    
    // Append new image files to the form data
    newImageFiles.forEach(file => {
      formData.append("image", file);
    });



    if (isUpdateMode) {
      // --- UPDATE LOGIC ---
      formData.append("cityId", selectedCityId);
      // Send the remaining existing image URLs
      formData.append("existingImages", JSON.stringify(existingImages));

      console.log("UPDATING city with FormData...");
      // Example: await fetch(`/api/cities/${selectedCityId}`, { method: 'PUT', body: formData });
      alert(`City with ID ${selectedCityId} updated successfully!`);
    } else {
      // --- CREATE LOGIC ---
      formData.append("id", selectedState);

      console.log("form data in ceate city:-->", formData);

      const res = await apiClient.post("/admin/city", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if(res){
        toast.success("City created successfully!");
      }

      resetFormFields();
    }
  };
  
  // --- Render Helper for Image Preview ---
  const renderImagePreviews = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {/* Show existing images for the selected city */}
      {existingImages.map((url) => (
        <div key={url} className="relative group">
          <img src={url} alt="Existing city view" className="h-28 w-full object-cover rounded-lg"/>
          <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={16}/>
          </button>
        </div>
      ))}
      {/* Show newly selected image previews */}
      {newImageFiles.map((file, index) => (
        <div key={file.name + index} className="relative group">
          <img src={URL.createObjectURL(file)} alt="New upload preview" className="h-28 w-full object-cover rounded-lg"/>
          <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={16}/>
          </button>
        </div>
      ))}
    </div>
  );


  return (
    <div className="flex flex-col gap-y-8 p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">City Management</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {isUpdateMode ? `Editing city: ${cityName}` : "Create a new city by selecting a state."}
        </p>
      </div>

      {/* Selection Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <div>
            <label htmlFor="stateSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select State</label>
            <select id="stateSelect" value={selectedState} onChange={handleStateChange} className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50" disabled={isStateListLoading}>
              <option value="">{isStateListLoading ? "Loading..." : "-- Select a State --"}</option>
              {stateList.map((state) => <option key={state._id} value={state._id}>{state.destination_name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="citySelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select City (Optional)</label>
            <select id="citySelect" value={selectedCityId} onChange={handleCityChange} className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50" disabled={!selectedState || isCityListLoading}>
              <option value="">{isCityListLoading ? "Loading..." : "-- Select to Edit --"}</option>
              {cityList?.map((city) => <option key={city._id} value={city._id}>{city.city_name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleFormSubmit}>
        <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${!selectedState ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-y-6">
              <div>
                <label htmlFor="cityName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City Name</label>
                <input type="text" id="cityName" value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder="e.g., Los Angeles" className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"/>
              </div>
              <div>
                <label htmlFor="visibilitySelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Visibility</label>
                <select id="visibilitySelect" value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
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
          
          {/* ----- NEW: Image Uploader Section ----- */}
          <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City Images</label>
            <div className="mt-2">
              {(existingImages.length > 0 || newImageFiles.length > 0) && renderImagePreviews()}
            </div>
            <label htmlFor="image-upload" className="mt-4 flex justify-center w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 transition-colors hover:border-blue-500 dark:border-slate-700 dark:hover:border-blue-600">
                <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-2 text-sm font-semibold text-blue-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF up to 10MB</p>
                    <input id="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange}/>
                </div>
            </label>
          </div>
          
           {/* Form Submission Button */}
           <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-end">
              <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!selectedState || !cityName}>
                {isUpdateMode ? 'Update City' : 'Create City'}
              </button>
            </div>
        </div>
      </form>
    </div>
  )
}

export default CreateCity;