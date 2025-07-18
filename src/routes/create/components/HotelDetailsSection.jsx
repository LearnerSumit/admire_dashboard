import { PlusCircle, Trash2 } from "lucide-react";

const HotelDetailsSection = ({ formData, handleArrayChange, handleAddItem, handleRemoveItem, styles }) => {
  const { cardStyle, labelStyle, inputStyle, buttonStyle, removeButtonStyle } = styles;

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
      <div className="space-y-6">
        {formData.hotel_details.map((hotel, index) => (
          <div key={index} className="p-4 border border-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className={labelStyle}>Type</label>
                <select name="type" value={hotel.type} onChange={(e) => handleArrayChange(e, index, "hotel_details")} className={inputStyle} required>
                  <option value="Delux">Delux</option>
                  <option value="Super Delux">Super Delux</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className={labelStyle}>Room Type</label>
                <input type="text" name="roomType" value={hotel.roomType} onChange={(e) => handleArrayChange(e, index, "hotel_details")} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Price ($)</label>
                <input type="number" name="price" value={hotel.price} onChange={(e) => handleArrayChange(e, index, "hotel_details")} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Discount ($)</label>
                <input type="number" name="discount" value={hotel.discount} onChange={(e) => handleArrayChange(e, index, "hotel_details")} className={inputStyle} />
              </div>
              {formData.hotel_details.length > 1 && (
                <div className="flex items-end">
                  <button type="button" onClick={() => handleRemoveItem(index, "hotel_details")} className={removeButtonStyle}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => handleAddItem("hotel_details", { type: "Delux", roomType: "", price: "", discount: "" })} className={`${buttonStyle} mt-4`}>
        <PlusCircle size={16} /> Add Hotel Option
      </button>
    </div>
  );
};

export default HotelDetailsSection;