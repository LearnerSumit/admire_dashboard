import {
  IndianRupee,
  Percent,
  BadgeIndianRupee,
  Image as ImageIcon,
} from "lucide-react";

const PricingSection = ({ formData, handleInputChange, styles }) => {
  const { labelStyle, inputStyle,cardStyle } = styles;

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Pricing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pricing" className={labelStyle}>
            <IndianRupee className="inline mr-1 text-muted-foreground" size={16} />
            Standard Price
          </label>
          <input
            type="number"
            name="pricing"
            id="pricing"
            value={formData.pricing}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="Enter standard price"
          />
        </div>

        <div>
          <label htmlFor="best_price" className={labelStyle}>
            <BadgeIndianRupee className="inline mr-1 text-muted-foreground" size={16} />
            Best Quote (optional)
          </label>
          <input
            type="number"
            name="best_price"
            id="best_price"
            value={formData.best_price || ""}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="Enter best deal quote"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="discount" className={labelStyle}>
            <Percent className="inline mr-1 text-muted-foreground" size={16} />
            Discount
          </label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="Enter discount if any"
          />
        </div>

        
      </div>
    </div>
  );
};

export default PricingSection;
