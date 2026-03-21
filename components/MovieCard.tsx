import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const GENRE_MAP: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  genre_ids,
  popularity,
}: Movie) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity
        className="w-[30%] mb-4"
        activeOpacity={0.7}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View className="relative">
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
            }}
            className="w-full h-52 rounded-lg bg-dark-200"
            resizeMode="cover"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0.6 }}
          />
          {popularity > 300 && (
            <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
              <Text className="text-xs text-white font-bold">🔥</Text>
            </View>
          )}
        </View>

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1 mt-1">
          <Image source={icons.star} className="size-4" tintColor="#FFD700" />
          <Text className="text-xs text-yellow-400 font-bold">
            {(vote_average / 2).toFixed(1)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-light-300 font-medium">
            {release_date?.split("-")[0]}
          </Text>
          {genre_ids?.[0] && (
            <Text className="text-xs text-light-300 font-medium">
              {GENRE_MAP[genre_ids[0]]}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
