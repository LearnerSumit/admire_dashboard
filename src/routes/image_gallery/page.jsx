import { useEffect, useState } from "react";
import axios from "axios";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from 'react-toastify'; // Import the toast library
import { usePlaceStore } from "../../stores/usePlaceStore";
import { ENV } from "../../constants/api";

const ImageGallery = () => {
    // Component state
    const [travelType, setTravelType] = useState("domestic");
    const [selectedPlace, setSelectedPlace] = useState("");
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Zustand store integration
    const { galleryPlaces, fetchGalleryPlaces } = usePlaceStore();


    // Effect to fetch places when travel type changes
    useEffect(() => {
        fetchGalleryPlaces(travelType);
    }, [travelType, fetchGalleryPlaces]);

    // Handler for file input changes
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + images.length > 20) {
            // Replaced alert with toast.warn
            toast.warn("You can upload a maximum of 20 images.");
            return;
        }
        setImages((prev) => [...prev, ...selectedFiles]);
    };

    // Handler for removing a single image from the preview
    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // Handler for changing travel type radio buttons
    const handleTypeChange = (e) => {
        setTravelType(e.target.value);
        setSelectedPlace("");
        setImages([]);
    };

    // Handler for changing the destination dropdown
    const handlePlaceChange = (e) => {
        setSelectedPlace(e.target.value);
    };

    // Form submission handler with toast notifications
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPlace || images.length === 0) {
            // Replaced alert with toast.error
            toast.error("Please select a destination and at least one image.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("destination", selectedPlace);
        images.forEach((imageFile) => {
            formData.append("image", imageFile);
        });

        try {
            const response = await axios.post(`${ENV.API_BASE_URL}/admin/image-Gallery`, formData);

            console.log("Upload successful:", response.data);
            // Replaced alert with toast.success
            toast.success("Images uploaded successfully!");

            // Reset form state
            setImages([]);
            setSelectedPlace("");

        } catch (error) {
            // Replaced all error alerts with toast.error
            if (error.response) {
                console.error("Server Error:", error.response.data);
                toast.error(error.response.data.message || 'Upload failed: Server error');
            } else if (error.request) {
                console.error("Network Error:", error.request);
                toast.error("Upload failed: No response from server. Check network connection.");
            } else {
                console.error("Error:", error.message);
                toast.error(`An error occurred: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 sm:p-10">
            <form
                onSubmit={handleSubmit}
                className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8 border border-gray-200 dark:border-gray-700"
            >
                <h1 className="text-3xl font-bold border-b pb-3 border-gray-300 dark:border-gray-600">
                    Image Gallery
                </h1>

                {/* Travel Type Radio */}
                <div>
                    <p className="text-lg font-medium mb-2">Select Travel Type:</p>
                    <div className="flex gap-6">
                        {["domestic", "international"].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value={type}
                                    checked={travelType === type}
                                    onChange={handleTypeChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                />
                                <span className="capitalize text-gray-700 dark:text-gray-300">
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Destination Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Destination
                    </label>
                    <select
                        value={selectedPlace}
                        onChange={handlePlaceChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">-- Select a Destination --</option>
                        {galleryPlaces.map((place) => (
                            <option key={place._id} value={place.destination_name}>{place.destination_name}</option>
                        ))}
                    </select>
                </div>

                {/* Image Upload Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload Images (Max 20)
                    </label>
                    <label
                        htmlFor="imageUpload"
                        className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                        <ImagePlus size={36} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                            Click to upload or drag & drop images here
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {images.length} / 20 selected
                        </span>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                    <div>
                        <p className="text-lg font-semibold mb-3">Image Preview</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative rounded border border-gray-300 dark:border-gray-600 overflow-hidden group"
                                >
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`preview-${idx}`}
                                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                        className="h-24 w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!selectedPlace || images.length === 0 || isLoading}
                    className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <span>Upload Images and Create Post</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ImageGallery;