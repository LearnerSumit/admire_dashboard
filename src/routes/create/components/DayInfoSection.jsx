import { PlusCircle, Trash2, MapPin, CalendarDays, AlignLeft } from "lucide-react";

const DayInfoSection = ({
  formData,
  handleArrayChange,
  handleAddItem,
  handleRemoveItem,
  styles,
}) => {
  const {
    cardStyle,
    labelStyle,
    inputStyle,
    buttonStyle,
    removeButtonStyle,
  } = styles;

  // console.log("console in Days Info Section: ",formData.days_information)

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4">
        <CalendarDays className="inline mr-2 text-muted-foreground" size={20} />
        Day-by-Day Itinerary
      </h2>
      <div className="space-y-6">
        {formData.days_information.map((dayInfo, index) => (
          <div
            key={index}
            className="p-4 border border-gray-700 rounded-lg space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                <CalendarDays className="inline mr-1 text-blue-500" size={18} />
                Day {dayInfo.day}
              </h3>
              {formData.days_information.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveItem(index, "days_information")
                  }
                  className={removeButtonStyle}
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Day Number */}
              <div>
                <label className={labelStyle}>
                  <CalendarDays className="inline mr-2 text-muted-foreground" size={16} />
                  Day Number
                </label>
                <input
                  type="number"
                  name="day"
                  value={dayInfo.day}
                  onChange={(e) =>
                    handleArrayChange(e, index, "days_information")
                  }
                  className={inputStyle}
                  disabled
                />
              </div>

              {/* Location Name */}
              <div>
                <label className={labelStyle}>
                  <MapPin className="inline mr-2 text-muted-foreground" size={16} />
                  Location Name
                </label>
                <input
                  type="text"
                  name="locationName"
                  value={dayInfo.locationName}
                  onChange={(e) =>
                    handleArrayChange(e, index, "days_information")
                  }
                  className={inputStyle}
                  placeholder="e.g., Agra Fort"
                />
              </div>
            </div>

            {/* Location Detail */}
            <div>
              <label className={labelStyle}>
                <AlignLeft className="inline mr-2 text-muted-foreground" size={16} />
                Location Detail
              </label>
              <textarea
                name="locationDetail"
                rows="3"
                value={dayInfo.locationDetail}
                onChange={(e) =>
                  handleArrayChange(e, index, "days_information")
                }
                className={inputStyle}
                placeholder="Describe the activities, places, and highlights of this day..."
              ></textarea>
            </div>
          </div>
        ))}
      </div>

      {/* Add Day Button */}
      {formData.duration === "Custom" && (
        <button
          type="button"
          onClick={() =>
            handleAddItem("days_information", {
              day: `${formData.days_information.length + 1}`,
              locationName: "",
              locationDetail: "",
            })
          }
          className={`${buttonStyle} mt-4`}
        >
          <PlusCircle size={16} />
          Add Day
        </button>
      )}
    </div>
  );
};

export default DayInfoSection;
