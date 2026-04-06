import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Saved = () => {
  const { data: savedMovies, loading, refetch } = useFetch(getSavedMovies);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (loading) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <View className="flex-1 px-5 pt-20">
        <View className="flex-row items-center gap-x-3 mb-5">
          <Image source={icons.save} className="size-8" tintColor="#AB8BFF" />
          <Text className="text-white font-bold text-2xl">Saved Movies</Text>
        </View>

        {savedMovies && savedMovies.length > 0 ? (
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              marginBottom: 10,
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Image
              source={icons.save}
              className="size-16 mb-4"
              tintColor="#666"
            />
            <Text className="text-gray-500 text-lg">No saved movies yet</Text>
            <Text className="text-gray-600 text-sm mt-2">
              Save movies to watch them later
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Saved;
