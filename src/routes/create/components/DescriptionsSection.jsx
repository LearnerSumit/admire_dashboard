import {
  Landmark,
  ListPlus,
  Ban,
  FileText,
  CreditCard,
  ShieldX,
} from "lucide-react";

const DescriptionsSection = ({ formData, handleInputChange, styles }) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  return (
    <div className={`${cardStyle} space-y-4`}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        <FileText className="inline mr-2 text-primary" size={20} />
        Descriptions
      </h2>

      {/* Destination Detail */}
      <div>
        <label htmlFor="destination_detail" className={labelStyle}>
          <Landmark className="inline mr-2 text-muted-foreground" size={16} />
          Destination Detail
        </label>
        <textarea
          name="destination_detail"
          id="destination_detail"
          rows="4"
          value={formData.destination_detail}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="Write a short description about the destination..."
        ></textarea>
      </div>

      {/* Inclusions */}
      <div>
        <label htmlFor="inclusion" className={labelStyle}>
          <ListPlus className="inline mr-2 text-muted-foreground" size={16} />
          Inclusions <span className="text-xs text-muted-foreground">(comma separated)</span>
        </label>
        <textarea
          name="inclusion"
          id="inclusion"
          rows="4"
          value={formData.inclusion}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="e.g., Hotel stay, Meals, Airport transfer"
        ></textarea>
      </div>

      {/* Exclusions */}
      <div>
        <label htmlFor="exclusion" className={labelStyle}>
          <Ban className="inline mr-2 text-muted-foreground" size={16} />
          Exclusions <span className="text-xs text-muted-foreground">(comma separated)</span>
        </label>
        <textarea
          name="exclusion"
          id="exclusion"
          rows="4"
          value={formData.exclusion}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="e.g., Personal expenses, Travel insurance"
        ></textarea>
      </div>

      {/* Terms & Conditions */}
      <div>
        <label htmlFor="terms_and_conditions" className={labelStyle}>
          <FileText className="inline mr-2 text-muted-foreground" size={16} />
          Terms & Conditions
        </label>
        <textarea
          name="terms_and_conditions"
          id="terms_and_conditions"
          rows="4"
          value={formData.terms_and_conditions}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="Specify your terms and conditions here..."
        ></textarea>
      </div>

      {/* Payment Mode */}
      <div>
        <label htmlFor="payment_mode" className={labelStyle}>
          <CreditCard className="inline mr-2 text-muted-foreground" size={16} />
          Payment Mode
        </label>
        <textarea
          name="payment_mode"
          id="payment_mode"
          rows="4"
          value={formData.payment_mode || ""}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="e.g., Online payment, Cash on arrival"
        ></textarea>
      </div>

      {/* Cancellation Policy */}
      <div>
        <label htmlFor="cancellation_policy" className={labelStyle}>
          <ShieldX className="inline mr-2 text-muted-foreground" size={16} />
          Cancellation Policy
        </label>
        <textarea
          name="cancellation_policy"
          id="cancellation_policy"
          rows="4"
          value={formData.cancellation_policy || ""}
          onChange={handleInputChange}
          className={inputStyle}
          placeholder="e.g., 100% refund 7 days prior to trip"
        ></textarea>
      </div>
    </div>
  );
};

export default DescriptionsSection;
