import { useState, useEffect } from "react";
import {
  CoreDetailsSection,
  DayInfoSection,
  DescriptionsSection,
  HotelDetailsSection,
  MediaSection,
  PricingSection,
} from "./components";
import { extractDaysAndNights } from "../../utils/extractDaysFromDuration";
import { apiClient } from "../../stores/authStore";
import { toast } from "react-toastify";

const CreateItineriesPage = () => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    title: "",
    travel_type: "domestic",
    itinerary_visibility: "public",
    itinerary_type: "flexible",
    duration: "",
    selected_destination: "",
    selected_destination_id: "",
    itinerary_theme: ["Family"],
    classification: ["Trending"],
    destination_detail: "",
    inclusion: "",
    exclusion: "",
    terms_and_conditions: "",
    payment_mode: "",
    cancellation_policy: "",
    pricing: "",
    discount: "",
    destination_images: [],
    destination_thumbnails: [],
    hotel_as_per_category: "",
    days_information: [{ day: "1", locationName: "", locationDetail: "" }],
  });

  console.log("console in FormData:---> ", formData);

 

  // --- HANDLER FUNCTIONS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, index, arrayName) => {
    const { name, value } = e.target;
    const newArray = [...formData[arrayName]];
    newArray[index][name] = value;
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const handleAddItem = (arrayName, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem],
    }));
  };

  const handleRemoveItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  // --- SUBMIT FUNCTION WITH TOAST NOTIFICATIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show a loading toast and get its ID
    const toastId = toast.loading("Creating your itinerary...");

    try {
      // Await the API call
      const response = await apiClient.post("/admin/itinerary", formData);

      // Check for a successful response status
      if (response.status === 200 || response.status === 201) {
        // Update the toast to a success message
        toast.update(toastId, {
          render: "Itinerary created successfully! 🎉",
          type: "success",
          isLoading: false,
          autoClose: 5000, // Auto close after 5 seconds
        });
        // Optionally, you can reset the form here
      } else {
        // Handle cases where the server returns a non-error status but it's not a success
        throw new Error(response.data?.message || "An unexpected server response occurred.");
      }
    } catch (error) {
      // Log the detailed error for debugging purposes
      console.error("Error creating itinerary:", error);

      // Extract a user-friendly error message from the server response, or use a default one
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create itinerary. Please try again.";

      // Update the toast to show the error message
      toast.update(toastId, {
        render: `Error: ${errorMessage} 🤯`,
        type: "error",
        isLoading: false,
        autoClose: 7000, // Keep the error message on screen a bit longer
      });
    }
  };


  // --- DYNAMIC DAY GENERATION ---
  useEffect(() => {
    if (formData.duration && formData.duration !== "Custom") {
      const { days } = extractDaysAndNights(formData.duration);
      const dayArray = Array.from({ length: days }, (_, i) => ({
        day: `${i + 1}`,
        locationName: "",
        locationDetail: "",
      }));
      setFormData((prev) => ({
        ...prev,
        days_information: dayArray,
      }));
    }
  }, [formData.duration]);

  useEffect(() => {
    if (formData.duration === "Custom" && formData.custom_days) {
      const days = parseInt(formData.custom_days, 10);
      if (!isNaN(days)) {
        const dayArray = Array.from({ length: days }, (_, i) => ({
          day: `${i + 1}`,
          locationName: "",
          locationDetail: "",
        }));
        setFormData((prev) => ({
          ...prev,
          days_information: dayArray,
        }));
      }
    }
  }, [formData.custom_days, formData.duration]);

  // --- SHARED STYLING ---
  const styleProps = {
    inputStyle:
      "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500",
    labelStyle: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
    cardStyle:
      "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700",
    buttonStyle:
      "flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500",
    removeButtonStyle:
      "flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500",
  };

  return (
    <div className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Itinerary</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <CoreDetailsSection
            formData={formData}
            handleInputChange={handleInputChange}
            styles={styleProps}
          />

          <DayInfoSection
            formData={formData}
            handleArrayChange={handleArrayChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            styles={styleProps}
          />

          <PricingSection
            formData={formData}
            handleInputChange={handleInputChange}
            styles={styleProps}
          />

          <MediaSection
            formData={formData}
            setFormData={setFormData}
            styles={styleProps}
          />

          <DescriptionsSection
            formData={formData}
            handleInputChange={handleInputChange}
            styles={styleProps}
            setFormData={setFormData}
          />

          <HotelDetailsSection
            formData={formData}
            handleArrayChange={handleArrayChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            styles={styleProps}
            handleInputChange={handleInputChange}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="text-lg font-bold rounded-lg bg-green-600 px-8 py-3 text-white shadow-sm hover:bg-green-500"
            >
              Create Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItineriesPage;