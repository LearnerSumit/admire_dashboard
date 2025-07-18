import { useRef } from "react";
import { CheckCircle, GalleryHorizontal, Image as ImageIcon, Upload } from "lucide-react";

const dummyImageData = {
  Delhi: [
    "https://placehold.co/600x400?text=Delhi+1",
    "https://placehold.co/600x400?text=Delhi+2",
    "https://placehold.co/600x400?text=Delhi+3",
  ],
  Goa: [
    "https://placehold.co/600x400?text=Goa+1",
    "https://placehold.co/600x400?text=Goa+2",
    "https://placehold.co/600x400?text=Goa+3",
  ],
  Jaipur: [
    "https://placehold.co/600x400?text=Jaipur+1",
    "https://placehold.co/600x400?text=Jaipur+2",
    "https://placehold.co/600x400?text=Jaipur+3",
  ],
};

const MediaSection = ({ formData, setFormData, styles }) => {
  const { labelStyle, inputStyle, cardStyle } = styles;
  const fileInputRef = useRef(null);

  const handleImageToggle = (imgUrl) => {
    const isSelected = formData.destination_images.includes(imgUrl);
    const updatedImages = isSelected
      ? formData.destination_images.filter((url) => url !== imgUrl)
      : [...formData.destination_images, imgUrl];

    setFormData((prev) => ({
      ...prev,
      destination_images: updatedImages,
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        destination_thumbnail: localUrl,
      }));
    }
  };

  return (
    <div className={`mt-8 space-y-6 ${cardStyle}`}>
      <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Media</h2>

      {/* Thumbnail Upload */}
      <div>
        <label className={labelStyle}>
          <ImageIcon className="inline mr-1 text-muted-foreground" size={16} />
          Upload Thumbnail Image
        </label>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            <Upload size={16} className="mr-2" />
            Choose File
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleThumbnailUpload}
            className="hidden"
          />

          {formData.destination_thumbnail && (
            <img
              src={formData.destination_thumbnail}
              alt="Thumbnail Preview"
              className="w-20 h-14 object-cover rounded border"
            />
          )}
        </div>
      </div>

      {/* Auto Image Grid */}
      {formData.selected_destination && dummyImageData[formData.selected_destination] ? (
        <>
          <label className={labelStyle}>
            <GalleryHorizontal className="inline mr-1 text-muted-foreground" size={16} />
            Select Images for {formData.selected_destination}
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {dummyImageData[formData.selected_destination].map((imgUrl, idx) => {
              const isSelected = formData.destination_images.includes(imgUrl);
              return (
                <div
                  key={idx}
                  className={`relative cursor-pointer border-2 rounded-md transition ${
                    isSelected ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => handleImageToggle(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`img-${idx}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                  {isSelected && (
                    <CheckCircle
                      size={18}
                      className="absolute top-1 right-1 text-blue-600 bg-white rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Please select a destination in Core Details section to show available images.
        </p>
      )}
    </div>
  );
};

export default MediaSection;
