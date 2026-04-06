import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies, getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { Image, ScrollView, Text, View } from "react-native";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View className="bg-dark-200 rounded-lg p-4 flex-1">
    <Text className="text-light-300 text-sm mb-1">{label}</Text>
    <Text className="text-white font-bold text-2xl">{value}</Text>
  </View>
);

const Profile = () => {
  const { data: savedMovies, refetch: refetchSaved } = useFetch(getSavedMovies);
  const { data: trendingMovies, refetch: refetchTrending } =
    useFetch(getTrendingMovies);

  useFocusEffect(
    useCallback(() => {
      refetchSaved();
      refetchTrending();
    }, [refetchSaved, refetchTrending]),
  );

  const totalSearches =
    trendingMovies?.reduce((sum, movie) => sum + movie.count, 0) || 0;

  return (
    <View className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5 pt-20"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="bg-accent rounded-full p-6 mb-4">
            <Image source={icons.person} className="size-16" tintColor="#fff" />
          </View>
          <Text className="text-white font-bold text-2xl">Movie Explorer</Text>
          <Text className="text-light-300 text-sm mt-1">
            Your movie journey
          </Text>
        </View>

        {/* Stats */}
        <Text className="text-white font-bold text-lg mb-3">Statistics</Text>
        <View className="flex-row gap-3 mb-6">
          <StatCard label="Saved Movies" value={savedMovies?.length || 0} />
          <StatCard label="Total Searches" value={totalSearches} />
        </View>

        {/* Top Searched Movies */}
        {trendingMovies && trendingMovies.length > 0 && (
          <View className="mb-6">
            <Text className="text-white font-bold text-lg mb-3">
              Your Most Searched
            </Text>
            {trendingMovies.slice(0, 5).map((movie, index) => (
              <View
                key={movie.movie_id}
                className="bg-dark-200 rounded-lg p-3 mb-2 flex-row items-center"
              >
                <Text className="text-accent font-bold text-lg w-8">
                  {index + 1}
                </Text>
                <Image
                  source={{ uri: movie.poster_url }}
                  className="w-12 h-16 rounded mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-white font-semibold" numberOfLines={1}>
                    {movie.title}
                  </Text>
                  <Text className="text-light-300 text-sm">
                    {movie.count} {movie.count === 1 ? "search" : "searches"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* App Info */}
        <View className="bg-dark-200 rounded-lg p-4 mt-4">
          <Text className="text-light-300 text-sm text-center">
            Movie App v1.0 • Practice Project
          </Text>
          <Text className="text-gray-600 text-xs text-center mt-1">
            Built with React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
