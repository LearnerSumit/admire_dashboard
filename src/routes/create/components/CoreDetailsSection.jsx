import { Globe, MapPin, Calendar, Eye, Layers, ListChecks, Text } from "lucide-react";
import { useEffect } from "react";
import { usePlaceStore } from "../../../stores/usePlaceStore";

const CoreDetailsSection = ({ formData, handleInputChange, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  const themes = ['Family', 'Honeymoon', 'Adventures', 'Solo'];

  // highlight-start
  // Updated to use the primary state and actions from the store
  const { 
    destinationList, 
    fetchDestinationList, 
    isListLoading 
  } = usePlaceStore();
  // highlight-end

  const handleThemeChange = (e) => {
    const { value, checked } = e.target;
    const updatedThemes = checked
      ? [...formData.itinerary_theme, value]
      : formData.itinerary_theme.filter((theme) => theme !== value);

    handleInputChange({
      target: {
        name: 'itinerary_theme',
        value: updatedThemes,
      },
    });
  };

  const handleTravelTypeChange = (e) => {
    handleInputChange({ target: { name: 'travel_type', value: e.target.value } });
    handleInputChange({ target: { name: 'selected_destination', value: '' } });
  };


  // Effect to fetch the destination list when the travel type changes
  useEffect(() => {
    async function fetchPlacesData() {
      if (formData.travel_type) {
        // highlight-start
        // Calling the primary fetch action
        await fetchDestinationList(formData.travel_type);
        // highlight-end
      }
    }

    fetchPlacesData();
    // highlight-start
    // Updated dependency array
  }, [formData.travel_type, fetchDestinationList]);
  // highlight-end


  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        <Layers className="inline mr-2 text-primary" size={20} /> Core Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelStyle}>
            <Text className="inline mr-2 text-muted-foreground" size={16} /> Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Enter Itinerary Title"
            value={formData.title}
            onChange={handleInputChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Travel Type and Destination */}
        <div>
          <label className={labelStyle}>
            <Globe className="inline mr-2 text-muted-foreground" size={16} /> Travel Type
          </label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="travel_type"
                value="domestic"
                checked={formData.travel_type === 'domestic'}
                onChange={handleTravelTypeChange}
                className="form-radio"
              />
              Domestic
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="travel_type"
                value="international"
                checked={formData.travel_type === 'international'}
                onChange={handleTravelTypeChange}
                className="form-radio"
              />
              International
            </label>
          </div>

          <label htmlFor="selected_destination" className={`${labelStyle} mt-4 block`}>
            <MapPin className="inline mr-2 text-muted-foreground" size={16} /> Destination
          </label>
          <select
            name="selected_destination"
            id="selected_destination"
            value={formData.selected_destination}
            onChange={handleInputChange}
            className={inputStyle}
            // highlight-start
            // Disable dropdown while the list is loading
            disabled={isListLoading}
            // highlight-end
            required
          >
            {/* highlight-start */}
            {/* Show loading text while fetching */}
            <option value="">
              {isListLoading ? "Loading..." : "-- Select Destination --"}
            </option>
            {/* Map over the primary destinationList */}
            {destinationList.map((place) => (
              <option key={place._id} value={place.destination_name}>{place.destination_name}</option>
            ))}
            {/* highlight-end */}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className={labelStyle}>
            <Calendar className="inline mr-2 text-muted-foreground" size={16} /> Duration
          </label>
          <select
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className={inputStyle}
            required
          >
            <option value="">-- Select Duration --</option>
            <option value="2 Days / 1 Night">2 Days / 1 Night</option>
            <option value="3 Days / 2 Nights">3 Days / 2 Nights</option>
            <option value="4 Days / 3 Nights">4 Days / 3 Nights</option>
            <option value="5 Days / 4 Nights">5 Days / 4 Nights</option>
            <option value="6 Days / 5 Nights">6 Days / 5 Nights</option>
            <option value="7 Days / 6 Nights">7 Days / 6 Nights</option>
            <option value="10 Days / 9 Nights">10 Days / 9 Nights</option>
            <option value="Custom">Custom</option>
          </select>

          {/* Show only when Custom is selected */}
          {formData.duration === "Custom" && (
            <div className="flex gap-4 mt-3">
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-muted-foreground">Days</label>
                <input
                  type="number"
                  min="1"
                  name="custom_days"
                  value={formData.custom_days || ""}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: "custom_days",
                        value: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. 5"
                  className={inputStyle}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-muted-foreground">Nights</label>
                <input
                  type="number"
                  min="0"
                  name="custom_nights"
                  value={formData.custom_nights || ""}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: "custom_nights",
                        value: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. 4"
                  className={inputStyle}
                />
              </div>
            </div>
          )}
        </div>


        {/* Themes */}
        <div>
          <label className={labelStyle}>
            <ListChecks className="inline mr-2 text-muted-foreground" size={16} /> Theme
          </label>
          <div className="flex flex-wrap gap-3 mt-2">
            {themes.map((theme) => (
              <label key={theme} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={theme}
                  checked={formData.itinerary_theme.includes(theme)}
                  onChange={handleThemeChange}
                  className="form-checkbox"
                />
                <span>{theme}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Itinerary Type */}
        <div>
          <label htmlFor="itinerary_type" className={labelStyle}>
            <Layers className="inline mr-2 text-muted-foreground" size={16} /> Type
          </label>
          <select
            name="itinerary_type"
            id="itinerary_type"
            value={formData.itinerary_type}
            onChange={handleInputChange}
            className={inputStyle}
          >
            <option value="flexible">Flexible</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        {/* Visibility */}
        <div>
          <label htmlFor="itinerary_visibility" className={labelStyle}>
            <Eye className="inline mr-2 text-muted-foreground" size={16} /> Visibility
          </label>
          <select
            name="itinerary_visibility"
            id="itinerary_visibility"
            value={formData.itinerary_visibility}
            onChange={handleInputChange}
            className={inputStyle}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CoreDetailsSection;