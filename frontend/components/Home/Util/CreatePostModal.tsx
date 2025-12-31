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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create post</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl transition-colors">
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
            <p className="font-semibold text-foreground">{user?.username || "User"}</p>
            <select className="text-sm bg-muted text-foreground rounded px-2 py-1 mt-1 border border-border">
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
            className="w-full min-h-[120px] text-lg outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground"
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
                    className="absolute top-2 right-2 bg-card text-foreground rounded-full w-8 h-8 shadow-md hover:bg-accent flex items-center justify-center text-xl transition-colors">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Poll Options */}
          {showPoll && (
            <div className="mt-4 p-4 border border-border rounded-lg space-y-2 bg-muted/30">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-foreground">Poll Options</p>
                <button onClick={() => setShowPoll(false)} className="text-destructive hover:text-destructive/80 text-sm transition-colors">
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
                    className="flex-1 border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                  {pollOptions.length > 2 && (
                    <button onClick={() => removePollOption(index)} className="text-destructive hover:text-destructive/80 w-8 transition-colors">
                      ×
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button onClick={addPollOption} className="text-primary hover:text-primary/80 text-sm transition-colors">
                  + Add option
                </button>
              )}
            </div>
          )}

          {/* Event Form */}
          {showEvent && (
            <div className="mt-4 p-4 border border-border rounded-lg space-y-3 bg-muted/30">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-foreground">Event Details</p>
                <button onClick={() => setShowEvent(false)} className="text-destructive hover:text-destructive/80 text-sm transition-colors">
                  Remove Event
                </button>
              </div>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Event title"
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  className="border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                />
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                  className="border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                />
              </div>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Location"
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
        </div>

        {/* Add to Post Section */}
        <div className="px-4 py-3 border-t border-b border-border flex items-center justify-between">
          <span className="font-semibold text-foreground">Add to your post</span>
          <div className="flex items-center gap-2">
            {/* Photo */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="p-2 hover:bg-accent rounded-full transition-colors"
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
              className="p-2 hover:bg-accent rounded-full transition-colors"
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
              className={`p-2 hover:bg-accent rounded-full transition-colors ${showPoll ? "bg-primary/20" : ""}`}
              title="Create poll">
              <Image src="/poll.png" alt="" height={24} width={24} className="w-6 h-6" />
            </button>

            {/* Event */}
            <button
              onClick={() => setShowEvent(!showEvent)}
              className={`p-2 hover:bg-accent rounded-full transition-colors ${showEvent ? "bg-primary/20" : ""}`}
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
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
