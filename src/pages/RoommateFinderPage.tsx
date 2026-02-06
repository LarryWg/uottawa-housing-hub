import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, X, MapPin, Briefcase, Home, Calendar, Sparkles } from "lucide-react";

// Mock data - replace with your actual data source
const mockRoommates = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 24,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    budget: "2000-2500",
    moveInDate: "March 2026",
    bio: "Love cooking, yoga, and weekend hiking. Looking for a clean, respectful roommate who enjoys a balance of social time and quiet evenings.",
    interests: ["Cooking", "Yoga", "Hiking", "Reading"],
    preferences: {
      cleanliness: "Very clean",
      socialLevel: "Moderately social",
      pets: "Cat friendly",
      lifestyle: "Early bird"
    }
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 27,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    occupation: "Graphic Designer",
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
    occupation: "Graduate Student",
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
  const cardRef = useRef(null);

  const currentRoommate = roommates[currentIndex];

  const handleSwipe = (direction) => {
    if (isAnimating) return; // Prevent multiple swipes
    
    setIsAnimating(true);
    
    if (direction === "right") {
      console.log("Liked:", currentRoommate);
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
    if (isAnimating) return; // Don't allow dragging during animation
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
      // Determine swipe direction
      const direction = dragOffset.x > 0 ? "right" : "left";
      
      // Animate card off screen
      setDragOffset({
        x: dragOffset.x > 0 ? 1000 : -1000,
        y: dragOffset.y
      });
      
      handleSwipe(direction);
    } else {
      // Return to center
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
    if (isAnimating) return; // Prevent button spam
    
    setDragOffset({
      x: direction === "right" ? 1000 : -1000,
      y: 0
    });
    handleSwipe(direction);
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
                    <span className="text-sm font-medium">{currentRoommate.occupation}</span>
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
      <Footer />
    </div>
  );
};

export default RoommateFinderPage;