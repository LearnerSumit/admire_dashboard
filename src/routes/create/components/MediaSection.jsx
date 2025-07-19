import { useRef, useEffect, useState } from "react";
import { CheckCircle, GalleryHorizontal, Image as ImageIcon, Upload } from "lucide-react";
import { apiClient } from "../../../stores/authStore";

const MediaSection = ({ formData, setFormData, styles }) => {
  const { labelStyle, inputStyle, cardStyle } = styles;
  const fileInputRef = useRef(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch images from backend when selected_destination changes
  useEffect(() => {
    const fetchImages = async () => {
      if (!formData.selected_destination) {
        setGalleryImages([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await apiClient.get(`/admin/image-Gallery/${formData.selected_destination}`);
        setGalleryImages(res?.data?.imageGalleryData?.image || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setGalleryImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [formData.selected_destination]);

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

      {/* Fetched Gallery Images */}
      {formData.selected_destination ? (
        <>
          <label className={labelStyle}>
            <GalleryHorizontal className="inline mr-1 text-muted-foreground" size={16} />
            Select Images for {formData.selected_destination}
          </label>

          {isLoading ? (
            <p className="text-sm text-gray-500 italic">Loading images...</p>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {galleryImages.map((imgUrl, idx) => {
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
          ) : (
            <p className="text-sm text-gray-500 italic">No images found for this destination.</p>
          )}
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
