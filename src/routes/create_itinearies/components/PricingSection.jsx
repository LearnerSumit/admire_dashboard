import React, { useState } from "react";
import {
  IndianRupee,
  Percent,
  BadgeIndianRupee
} from "lucide-react";

const PricingSection = ({ formData, handleInputChange, styles }) => {
  const { labelStyle, inputStyle, cardStyle } = styles;

  const [isBestQuote, setIsBestQuote] = useState(false);

  const handleBestQuoteToggle = (e) => {
    setIsBestQuote(e.target.checked);

    // Clear best_price or pricing/discount based on selection
    if (e.target.checked) {
      handleInputChange({
        target: {
          name: "pricing",
          value: "",
        },
      });
      handleInputChange({
        target: {
          name: "discount",
          value: "",
        },
      });
    } else {
      handleInputChange({
        target: {
          name: "best_price",
          value: "",
        },
      });
    }
  };

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Pricing
      </h2>

      <div className="mb-4">
        <label htmlFor="best_quote_toggle" className={labelStyle}>
          <input
            type="checkbox"
            id="best_quote_toggle"
            checked={isBestQuote}
            onChange={handleBestQuoteToggle}
            className="mr-2"
          />
          <IndianRupee className="inline mr-1 text-muted-foreground" size={16} />
          As per best quote
        </label>
      </div>

      {!isBestQuote && (
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
      )}
    </div>
  );
};

export default PricingSection;
