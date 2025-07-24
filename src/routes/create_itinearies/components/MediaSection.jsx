import { useEffect, useState } from "react";
import { CheckCircle, GalleryHorizontal, Image as ImageIcon, Video, X } from "lucide-react";
import { apiClient } from "../../../stores/authStore";

const MediaSection = ({ formData, setFormData, styles }) => {
  const { labelStyle, cardStyle } = styles;

  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch gallery images from the backend when selected_destination changes
  // This data will be used for BOTH thumbnails and gallery sections.
  useEffect(() => {
    const fetchImages = async () => {
      // If no destination is selected, clear images and return
      if (!formData.selected_destination_id) {
        setGalleryImages([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await apiClient.get(`/admin/image-Gallery/${formData.selected_destination_id}`);
        console.log(res);
        // Set the fetched images to state
        setGalleryImages(res?.data?.imageGalleryData?.image || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setGalleryImages([]); // Clear images on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [formData.selected_destination_id]);

  // Toggles an image in the main destination_images array
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

  // Toggles an image in the destination_thumbnails array
  const handleThumbnailToggle = (thumbUrl) => {
    const isSelected = formData.destination_thumbnails.includes(thumbUrl);
    const updatedThumbnails = isSelected
      ? formData.destination_thumbnails.filter((url) => url !== thumbUrl)
      : [...formData.destination_thumbnails, thumbUrl];

    setFormData((prev) => ({
      ...prev,
      destination_thumbnails: updatedThumbnails,
    }));
  };

  // Handles the video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // Removes the selected video
  const handleRemoveVideo = () => {
    setFormData((prev) => ({
      ...prev,
      destination_video: null,
    }));
    // Also reset the file input
    const fileInput = document.getElementById('video-upload');
    if (fileInput) {
      fileInput.value = "";
    }
  };


  const renderImageGrid = (images, selectedImages, onToggle, type) => {
    if (isLoading) {
      return <p className="text-sm text-gray-500 italic">Loading images...</p>;
    }
    if (images.length > 0) {
      return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((imgUrl, idx) => {
            const isSelected = selectedImages.includes(imgUrl);
            return (
              <div
                key={`${type}-${idx}`}
                className={`relative cursor-pointer border-2 rounded-md transition ${
                  isSelected ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => onToggle(imgUrl)}
              >
                <img
                  src={imgUrl}
                  alt={`${type}-${idx}`}
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
      );
    }
    return <p className="text-sm text-gray-500 italic">No images found for this destination.</p>;
  };

  return (
    <div className={`mt-8 space-y-6 ${cardStyle}`}>
      <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">Media</h2>

      {formData.selected_destination_id ? (
        <>
          {/* Video Upload Section */}
          <div className="space-y-3">
            <label className={`${labelStyle}`}>
              <Video className="inline mr-1 text-muted-foreground" size={16} />
              Upload a Video for {formData.selected_destination}
            </label>
            {formData.destination_video ? (
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {formData.destination_video.name}
                </p>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="ml-auto cursor-pointer p-1 text-gray-500 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            )}
          </div>


          {/* Thumbnail Selection Section */}
          <div className="space-y-3 pt-4">
            <label className={labelStyle}>
              <ImageIcon className="inline mr-1 text-muted-foreground" size={16} />
              Select Thumbnail Images for {formData.selected_destination}
            </label>
            {renderImageGrid(galleryImages, formData.destination_thumbnails, handleThumbnailToggle, "thumbnail")}
          </div>

          {/* Destination Images Selection Section */}
          <div className="space-y-3 pt-4">
            <label className={labelStyle}>
              <GalleryHorizontal className="inline mr-1 text-muted-foreground" size={16} />
              Select Destination Images for {formData.selected_destination}
            </label>
            {renderImageGrid(galleryImages, formData.destination_images, handleImageToggle, "gallery")}
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