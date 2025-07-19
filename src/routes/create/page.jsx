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

const CreateItineriesPage = () => {


  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    title: "",
    travel_type: "domestic",
    itinerary_visibility: "public",
    itinerary_type: "flexible",
    duration: "",
    selected_destination: "",
    itinerary_theme: ["Family"],
    destination_detail: "",
    inclusion: "",
    exclusion: "",
    terms_and_conditions: "",
    payment_mode: "",                     
    cancellation_policy: "",             
    pricing: "",
    best_price: "",
    discount: "",
    destination_images: [""],
    hotel_details: [{ type: "Delux", roomType: "", price: "", discount: "" }],
    days_information: [{ day: "1", locationName: "", locationDetail: "" }],
  });

  console.log("console in Itinerary Page: ",formData)

 





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

  // --- SUBMIT FUNCTION ---
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Itinerary Data:", JSON.stringify(formData, null, 2));
    alert("Form data has been logged to the console. Press F12 to view.");
  };


  // normal duration
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

  // custom duration
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



  // --- SHARED STYLING (Dark/Light aware) ---
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
            handleInputChange={handleInputChange}
            styles={styleProps}
          />

          {/* <PricingMediaSection
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            styles={styleProps}
            setFormData={setFormData}
          /> */}

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
          />



          {/* Submit Button */}
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
