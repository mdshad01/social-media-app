import Image from "next/image";
import React from "react";

const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500 font-medium">Sponsored Ads</span>
        <Image src="/more.png" alt="" width={12} height={12} />
      </div>
      {/* IMAGE */}

      {/* BUTTON */}
      <div className={`flex flex-col mt-4 ${size == "sm" ? " gap-2" : "gap-4"}`}>
        <div className={`relative w-full ${size == "sm" ? "h-28" : size == "md" ? "h-40" : "h-48"}`}>
          <Image
            src="https://images.pexels.com/photos/18142606/pexels-photo-18142606.jpeg"
            alt=""
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <Image
          src="https://images.pexels.com/photos/18142606/pexels-photo-18142606.jpeg"
          alt=""
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-blue-500 font-medium text-sm">Fruit Cocktail</span>
      </div>

      <p className={size === "sm" ? "text-xs" : "text-sm"}>
        {size === "sm"
          ? "Lorem ipsum, dolor sit amet consectetur adipisicing elit."
          : size === "md"
          ? "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti voluptas veniam asperiores rerum sapiente autem modi vero eum."
          : "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate quos ipsum quae at velit assumenda et ipsa consectetur, consequuntur, necessitatibus fugiat placeat dolorem? Quae, totam placeat officia sint at voluptate? Maiores modi eum hic sunt quam architecto! Commodi obcaecati illo assumenda doloremque in explicabo accusantium. Repellat quibusdam illum error modi, blanditiis animi, quasi ducimus asperiores nemo consectetur at exercitationem pariatur!"}
      </p>
      <button className="bg-slate-200 w-full p-1 mt-3 rounded-lg text-gray-600">Learn More</button>
    </div>
  );
};

export default Ad;
