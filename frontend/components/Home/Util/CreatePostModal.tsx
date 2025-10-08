import { User } from "@/type";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMediaType: "photo" | "video" | "poll" | "event" | null;
  user: User;
}

const CreatePostModal = ({ isOpen, onClose, initialMediaType, user }: Props) => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasTriggeredInitialAction = useRef(false);

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Handle initial media type - FIXED VERSION
  useEffect(() => {
    if (isOpen && initialMediaType && !hasTriggeredInitialAction.current) {
      hasTriggeredInitialAction.current = true;

      // Use setTimeout to avoid double trigger
      setTimeout(() => {
        if (initialMediaType === "photo") {
          photoInputRef.current?.click();
        } else if (initialMediaType === "video") {
          videoInputRef.current?.click();
        } else if (initialMediaType === "poll") {
          setShowPoll(true);
        } else if (initialMediaType === "event") {
          setShowEvent(true);
        }
      }, 100);
    }

    // Reset when modal closes
    if (!isOpen) {
      hasTriggeredInitialAction.current = false;
    }
  }, [isOpen, initialMediaType]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });

    // Reset input value to allow selecting same file again
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePost = async () => {
    // Your post submission logic here
    console.log("Posting:", {
      postText,
      selectedFiles,
      pollOptions: showPoll ? pollOptions : null,
      eventData: showEvent ? eventData : null,
    });

    // Reset and close
    setPostText("");
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowPoll(false);
    setShowEvent(false);
    setPollOptions(["", ""]);
    setEventData({ title: "", date: "", time: "", location: "" });
    onClose();
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Create post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <Image
            src={user?.profilePicture || "https://images.pexels.com/photos/16654239/pexels-photo-16654239.jpeg"}
            alt=""
            height={56}
            width={56}
            className="w-14 h-14 object-cover rounded-full"
          />
          <div>
            <p className="font-semibold">{user?.username || "User"}</p>
            <select className="text-sm bg-gray-100 rounded px-2 py-1 mt-1">
              <option>Public</option>
              <option>Friends</option>
              <option>Only me</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="px-4 pb-4">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[120px] text-lg outline-none resize-none"
          />

          {/* File Previews */}
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  {selectedFiles[index]?.type.startsWith("video") ? (
                    <video src={url} controls className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <img src={url} alt={`Preview ${index}`} className="w-full h-48 object-cover rounded-lg" />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 shadow-md hover:bg-gray-100 flex items-center justify-center text-xl">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Poll Options */}
          {showPoll && (
            <div className="mt-4 p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Poll Options</p>
                <button onClick={() => setShowPoll(false)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove Poll
                </button>
              </div>
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  {pollOptions.length > 2 && (
                    <button onClick={() => removePollOption(index)} className="text-red-500 hover:text-red-700 w-8">
                      ×
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button onClick={addPollOption} className="text-blue-500 hover:text-blue-700 text-sm">
                  + Add option
                </button>
              )}
            </div>
          )}

          {/* Event Form */}
          {showEvent && (
            <div className="mt-4 p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Event Details</p>
                <button onClick={() => setShowEvent(false)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove Event
                </button>
              </div>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Event title"
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />
              </div>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Location"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Add to Post Section */}
        <div className="px-4 py-3 border-t border-b flex items-center justify-between">
          <span className="font-semibold">Add to your post</span>
          <div className="flex items-center gap-2">
            {/* Photo */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Add photos">
              <Image src="/addimage.png" alt="" height={24} width={24} className="w-6 h-6" />
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e, "photo")}
              className="hidden"
            />

            {/* Video */}
            <button
              onClick={() => videoInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Add video">
              <Image src="/addvideo.png" alt="" height={24} width={24} className="w-6 h-6" />
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileSelect(e, "video")}
              className="hidden"
            />

            {/* Poll */}
            <button
              onClick={() => setShowPoll(!showPoll)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${showPoll ? "bg-blue-100" : ""}`}
              title="Create poll">
              <Image src="/poll.png" alt="" height={24} width={24} className="w-6 h-6" />
            </button>

            {/* Event */}
            <button
              onClick={() => setShowEvent(!showEvent)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${showEvent ? "bg-blue-100" : ""}`}
              title="Create event">
              <Image src="/addevent.png" alt="" height={24} width={24} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Post Button */}
        <div className="p-4">
          <button
            onClick={handlePost}
            disabled={!postText.trim() && selectedFiles.length === 0 && !showPoll && !showEvent}
            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
              postText.trim() || selectedFiles.length > 0 || showPoll || showEvent
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
