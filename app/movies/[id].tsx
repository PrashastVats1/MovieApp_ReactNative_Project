import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { isMovieSaved, saveMovie, unsaveMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const formatCurrency = (amount: number | undefined | null) => {
  if (!amount || amount === 0) return "N/A";

  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)} million`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
};

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (movie?.id) {
        const saved = await isMovieSaved(movie.id);
        setIsSaved(saved);
      }
    };
    checkSaved();
  }, [movie?.id]);

  const handleSaveToggle = async () => {
    if (!movie) return;

    setSavingLoading(true);
    try {
      if (isSaved) {
        await unsaveMovie(movie.id);
        setIsSaved(false);
        Alert.alert("Removed", "Movie removed from saved list");
      } else {
        await saveMovie({
          ...movie,
          genre_ids: movie.genres?.map((g: any) => g.id) || [],
        } as Movie);
        setIsSaved(true);
        Alert.alert("Saved", "Movie added to saved list");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save movie");
    } finally {
      setSavingLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="relative">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="cover"
          />

          {/* Save Button */}
          <TouchableOpacity
            className="absolute top-12 right-5 bg-dark-200 p-3 rounded-full"
            onPress={handleSaveToggle}
            disabled={savingLoading}
          >
            <Image
              source={icons.save}
              className="size-6"
              tintColor={isSaved ? "#AB8BFF" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>

          {movie?.tagline && (
            <Text className="text-light-300 italic text-sm mt-2">
              {`"${movie.tagline}"`}
            </Text>
          )}

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" tintColor="#FFD700" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Status" value={movie?.status} />
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
          />

          <View className="flex-row justify-between w-full mt-5">
            <View className="flex-col items-start">
              <Text className="text-light-200 font-normal text-sm">Budget</Text>
              <Text className="text-light-100 font-bold text-sm mt-2">
                {formatCurrency(movie?.budget)}
              </Text>
            </View>
            <View className="flex-col items-start">
              <Text className="text-light-200 font-normal text-sm">
                Revenue
              </Text>
              <Text className="text-light-100 font-bold text-sm mt-2">
                {formatCurrency(movie?.revenue)}
              </Text>
            </View>
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" - ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
