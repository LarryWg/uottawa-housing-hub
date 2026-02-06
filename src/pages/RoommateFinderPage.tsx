import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, X, MapPin, Briefcase, Home, Calendar, Sparkles, Plus, Upload } from "lucide-react";

// Mock data - replace with your actual data source
const mockRoommates = [
  {
    id: 1,
    name: "Taha Rashid",
    age: 19,
    image: "https://media.licdn.com/dms/image/v2/D4E03AQGCuRZawN-NOg/profile-displayphoto-crop_800_800/B4EZtYRABCJwAI-/0/1766712410544?e=1772064000&v=beta&t=KfyQJd4kzX0jPm4a8bf-CDvoXPz4c3pbI9g5KXfWsDk",
    program: "Software Engineering",
    location: "Ottawa, Ontario, Canada",
    budget: "3000-4500",
    moveInDate: "August 2026",
    bio: "Love running, biking, playing BeatSaber on my VR headset, and learning Japanese!",
    interests: ["Running", "Biking", "BeatSaber", "Learning Japanese"],
    preferences: {
      cleanliness: "Very clean",
      socialLevel: "Very social",
      pets: "No pets",
      lifestyle: "Early bird"
    }
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 27,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    program: "Graphic Designer",
    location: "Oakland, CA",
    budget: "1500-2000",
    moveInDate: "April 2026",
    bio: "Creative professional who works from home. I'm neat, quiet, and love hosting game nights occasionally. Plant dad to 15+ plants!",
    interests: ["Gaming", "Plants", "Photography", "Cooking"],
    preferences: {
      cleanliness: "Clean",
      socialLevel: "Social on weekends",
      pets: "No pets",
      lifestyle: "Night owl"
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    age: 22,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    program: "Graduate Student",
    location: "Berkeley, CA",
    budget: "1200-1800",
    moveInDate: "May 2026",
    bio: "PhD student studying environmental science. I'm studious but love unwinding with movie nights. Looking for someone chill and respectful of study time.",
    interests: ["Movies", "Running", "Coffee", "Sustainability"],
    preferences: {
      cleanliness: "Organized",
      socialLevel: "Quiet most days",
      pets: "Dog friendly",
      lifestyle: "Flexible schedule"
    }
  }
];

const RoommateFinderPage = () => {
  const [roommates, setRoommates] = useState(mockRoommates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newInterest, setNewInterest] = useState("");
  const cardRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    image: "",
    program: "",
    location: "",
    budget: "",
    moveInDate: "",
    bio: "",
    interests: [],
    preferences: {
      cleanliness: "",
      socialLevel: "",
      pets: "",
      lifestyle: ""
    }
  });

  const handleSubmitProfile = (e) => {
  e.preventDefault();
  
  // Create new profile with unique ID
  const newProfile = {
    id: Date.now(),
    ...formData,
    age: parseInt(formData.age)
  };
  
  console.log("New profile created:", newProfile);
  
  // Add to the roommates pool
  setRoommates([...roommates, newProfile]);
  
  // Reset form and close modal
  setFormData({
    name: "",
    age: "",
    image: "",
    program: "",
    location: "",
    budget: "",
    moveInDate: "",
    bio: "",
    interests: [],
    preferences: {
      cleanliness: "",
      socialLevel: "",
      pets: "",
      lifestyle: ""
    }
  });
  setImagePreview(null);
  setShowModal(false);
  
  alert("Profile created successfully! You can now see it in the swipe deck.");
};

  const currentRoommate = roommates[currentIndex];

  const handleSwipe = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === "right") {
      console.log("Liked:", currentRoommate);
      // TODO: Save to database/backend
    } else {
      console.log("Passed:", currentRoommate);
    }
    
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setIsAnimating(false);
      setIsDragging(false);
    }, 300);
  };

  const handleDragStart = (clientX, clientY) => {
    if (isAnimating) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging || isAnimating) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging || isAnimating) return;
    
    setIsDragging(false);
    
    const swipeThreshold = 100;
    
    if (Math.abs(dragOffset.x) > swipeThreshold) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      
      setDragOffset({
        x: dragOffset.x > 0 ? 1000 : -1000,
        y: dragOffset.y
      });
      
      handleSwipe(direction);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    handleDragEnd();
  };

  // Button handlers
  const handleButtonSwipe = (direction) => {
    if (isAnimating) return;
    
    setDragOffset({
      x: direction === "right" ? 1000 : -1000,
      y: 0
    });
    handleSwipe(direction);
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      preferences: { ...formData.preferences, [name]: value }
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && formData.interests.length < 8) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index)
    });
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    
    // TODO: Send to backend/database
    const newProfile = {
      id: Date.now(),
      ...formData,
      age: parseInt(formData.age)
    };
    
    console.log("New profile created:", newProfile);
    
    // Optionally add to local state for demo purposes
    // setRoommates([...roommates, newProfile]);
    
    // Reset form and close modal
    setFormData({
      name: "",
      age: "",
      image: "",
      program: "",
      location: "",
      budget: "",
      moveInDate: "",
      bio: "",
      interests: [],
      preferences: {
        cleanliness: "",
        socialLevel: "",
        pets: "",
        lifestyle: ""
      }
    });
    setImagePreview(null);
    setShowModal(false);
    
    alert("Profile created successfully! It will be visible to other users once approved.");
  };

  if (currentIndex >= roommates.length) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">No More Profiles</h1>
            <p className="text-muted-foreground">You've seen all available roommates. Check back later for more!</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const rotation = dragOffset.x / 20;
  const opacity = Math.abs(dragOffset.x) > 100 ? 0.5 : 1;

  return (
    <div 
      className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Create Profile Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              Create Profile
            </button>
          </div>

          {/* Card Stack */}
          <div className="relative mb-8 aspect-[3/4] w-full">
            {/* Next card preview */}
            {currentIndex + 1 < roommates.length && (
              <div className="absolute inset-0 scale-95 rounded-3xl bg-white shadow-lg opacity-50" />
            )}
            
            {/* Swipe indicators */}
            {isDragging && Math.abs(dragOffset.x) > 50 && (
              <>
                {dragOffset.x > 0 ? (
                  <div className="absolute left-8 top-8 z-10 rounded-lg border-4 border-green-500 bg-white px-6 py-3 text-2xl font-bold text-green-500 rotate-12 shadow-lg">
                    LIKE
                  </div>
                ) : (
                  <div className="absolute right-8 top-8 z-10 rounded-lg border-4 border-red-500 bg-white px-6 py-3 text-2xl font-bold text-red-500 -rotate-12 shadow-lg">
                    NOPE
                  </div>
                )}
              </>
            )}
            
            {/* Current card */}
            <div
              ref={cardRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
                opacity: opacity,
                transition: isDragging ? 'none' : 'all 0.3s ease-out',
                cursor: isAnimating ? 'default' : isDragging ? 'grabbing' : 'grab',
                pointerEvents: isAnimating ? 'none' : 'auto'
              }}
              className="absolute inset-0 overflow-hidden rounded-3xl bg-white shadow-2xl select-none"
            >
              {/* Profile Image */}
              <div className="relative h-2/5 overflow-hidden pointer-events-none">
                <img
                  src={currentRoommate.image}
                  alt={currentRoommate.name}
                  className="h-full w-full object-cover"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Name & Age Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-3xl font-bold text-white">
                    {currentRoommate.name}, {currentRoommate.age}
                  </h2>
                </div>
              </div>

              {/* Profile Details */}
              <div className="h-3/5 overflow-y-auto p-6">
                {/* Quick Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{currentRoommate.program}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{currentRoommate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="text-sm">Budget: ${currentRoommate.budget}/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Move-in: {currentRoommate.moveInDate}</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-gray-900">About</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {currentRoommate.bio}
                  </p>
                </div>

                {/* Interests */}
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-gray-900">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentRoommate.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Preferences</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Cleanliness:</span>
                      <p className="font-medium text-gray-700">{currentRoommate.preferences.cleanliness}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Social:</span>
                      <p className="font-medium text-gray-700">{currentRoommate.preferences.socialLevel}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pets:</span>
                      <p className="font-medium text-gray-700">{currentRoommate.preferences.pets}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Lifestyle:</span>
                      <p className="font-medium text-gray-700">{currentRoommate.preferences.lifestyle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            <button
              onClick={() => handleButtonSwipe("left")}
              disabled={isAnimating}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-500 bg-white text-red-500 shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Pass"
            >
              <X className="h-8 w-8" />
            </button>
            <button
              onClick={() => handleButtonSwipe("right")}
              disabled={isAnimating}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-500 bg-white text-green-500 shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Like"
            >
              <Heart className="h-8 w-8" />
            </button>
          </div>

          {/* Counter */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {currentIndex + 1} / {roommates.length}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-6 text-2xl font-bold">Create Your Profile</h2>
            
            <form onSubmit={handleSubmitProfile} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Age*</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="18"
                    max="100"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Program/Occupation*</label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Location*</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="City, State/Province, Country"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Budget ($/month)*</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1500-2000"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Move-in Date*</label>
                  <input
                    type="text"
                    name="moveInDate"
                    value={formData.moveInDate}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., May 2026"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Bio*</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Interests (max 8)</label>
                <div className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    placeholder="Add an interest"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    disabled={formData.interests.length >= 8}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="mb-4 font-semibold text-gray-900">Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Cleanliness*</label>
                    <select
                      name="cleanliness"
                      value={formData.preferences.cleanliness}
                      onChange={handlePreferenceChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select...</option>
                      <option value="Very clean">Very clean</option>
                      <option value="Clean">Clean</option>
                      <option value="Organized">Organized</option>
                      <option value="Relaxed">Relaxed</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Social Level*</label>
                    <select
                      name="socialLevel"
                      value={formData.preferences.socialLevel}
                      onChange={handlePreferenceChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select...</option>
                      <option value="Very social">Very social</option>
                      <option value="Moderately social">Moderately social</option>
                      <option value="Social on weekends">Social on weekends</option>
                      <option value="Quiet most days">Quiet most days</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Pets*</label>
                    <select
                      name="pets"
                      value={formData.preferences.pets}
                      onChange={handlePreferenceChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select...</option>
                      <option value="No pets">No pets</option>
                      <option value="Cat friendly">Cat friendly</option>
                      <option value="Dog friendly">Dog friendly</option>
                      <option value="All pets welcome">All pets welcome</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Lifestyle*</label>
                    <select
                      name="lifestyle"
                      value={formData.preferences.lifestyle}
                      onChange={handlePreferenceChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select...</option>
                      <option value="Early bird">Early bird</option>
                      <option value="Night owl">Night owl</option>
                      <option value="Flexible schedule">Flexible schedule</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary/90"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RoommateFinderPage;