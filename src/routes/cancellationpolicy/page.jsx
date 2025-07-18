import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { usePlaceStore } from "../../stores/usePlaceStore"; // Correctly import the store
import { Loader2, FileText, Edit, Save, MapPin } from "lucide-react";

// --- DUMMY DATA FOR CONTENT ---
// This part remains to manage the content of the selected item locally.
const allDummyContent = {
  'dom1': { content: 'These are the general terms and conditions for all domestic travel packages. Please read them carefully before booking.' },
  'dom2': { content: 'This is the official booking policy for all domestic packages. It includes details on payment schedules and confirmations.' },
  'int1': { content: 'These are the general terms and conditions for our international destinations. They cover important aspects of your travel.' },
  'int2': { content: 'This document contains crucial information regarding visa requirements for various international travel destinations.' }
};
// --- END OF DUMMY DATA ---


const CencellationMode = () => {
  // Local state for the component
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [travelType, setTravelType] = useState("domestic");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [textContent, setTextContent] = useState("");

  // Get state and actions from the Zustand store
  const { galleryPlaces, fetchGalleryPlaces,termsList,fetchTermsList, isListLoading } = usePlaceStore();

  // Effect to fetch places when the travel type changes
  useEffect(() => {
    // Call the action from the store to fetch the list of places
    fetchTermsList(travelType);
  }, [termsList, fetchTermsList]);
  
  // Effect to handle displaying dummy content when a place is selected
  useEffect(() => {
    if (selectedPlaceId) {
        // For demonstration, we'll just pull some dummy content.
        // You can use a more robust mapping in a real scenario.
        const dummyContent = allDummyContent[selectedPlaceId]?.content || "No specific terms found for this destination. Please review the general guidelines.";
        setTextContent(dummyContent);
        setIsEditing(false); // Reset editing state on new selection
    } else {
        setTextContent(""); // Clear content if no place is selected
    }
  }, [selectedPlaceId]);


  // SIMULATED: Handle saving the updated content
  const handleSave = () => {
    if (!selectedPlaceId) {
      toast.warn("Please select a destination to save cancellation for.");
      return;
    }
    setIsSaving(true);
    console.log("Simulating save for destination ID:", selectedPlaceId);
    console.log("New Content:", textContent);

    setTimeout(() => {
      try {
        // Update the dummy content in memory
        if (allDummyContent[selectedPlaceId]) {
          allDummyContent[selectedPlaceId].content = textContent;
        }
        toast.success("Cancellation Policy saved successfully!");
        setIsEditing(false);
      } catch (error) {
        toast.error("Something went wrong while saving.");
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1-second delay
  };

  const handleTypeChange = (e) => {
    setTravelType(e.target.value);
    setSelectedPlaceId(""); // Reset selection when type changes
  };
  
  const handlePlaceChange = (e) => {
    setSelectedPlaceId(e.target.value);
  };

  return (
    <div className="flex flex-col gap-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Destination Cancellation Policy Management
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Select a destination to view, edit, and manage its associated cancellation policy.
        </p>
      </div>

      {/* Selection Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Travel Type Radio */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Category
                </label>
                <div className="flex gap-6">
                    {["domestic", "international"].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value={type}
                                checked={travelType === type}
                                onChange={handleTypeChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-transparent"
                            />
                            <span className="capitalize text-slate-800 dark:text-slate-200">
                                {type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Destination Dropdown (Now Dynamic) */}
            <div>
                <label htmlFor="placeSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select Destination
                </label>
                <select
                    id="placeSelect"
                    value={selectedPlaceId}
                    onChange={handlePlaceChange}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                    disabled={isListLoading || termsList.length === 0}
                >
                    <option value="">
                      {isListLoading ? "Loading Destinations..." : "-- Select a Destination --"}
                    </option>
                    {termsList.map((place) => (
                        <option key={place._id} value={place._id}>{place.destination_name}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>


      {/* Content Card */}
      <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${!selectedPlaceId ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-x-3">
                <FileText className="size-6 text-slate-800 dark:text-slate-200" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Associated Cancellation Policy
                </h2>
            </div>
            <div className="flex items-center gap-x-3">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} disabled={!selectedPlaceId || isSaving} className="inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-600">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                  </button>
                ) : (
                  <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600">
                      {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Saving...</span></> : <><Save className="mr-2 h-4 w-4" /><span>Save</span></>}
                  </button>
                )}
            </div>
        </div>

        <div className="mt-6">
            {selectedPlaceId ? (
                <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    readOnly={!isEditing}
                    className="w-full min-h-[300px] rounded-lg border border-slate-300 bg-transparent p-4 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-slate-50/50 dark:disabled:bg-slate-800/50"
                    placeholder="Enter the cancellation policy for this destination..."
                    disabled={!isEditing}
                />
            ) : (
              <div className="text-center py-20 flex flex-col items-center justify-center">
                  <MapPin className="size-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isListLoading ? "Loading..." : "Please select a destination to manage its cancellation policy."}
                  </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CencellationMode;