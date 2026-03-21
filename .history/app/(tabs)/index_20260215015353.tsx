import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Image, ScrollView, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="w-full absolute z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <View className="h-[200px] bg-red-500 mb-4" />
        <View className="h-[200px] bg-blue-500 mb-4" />
        <View className="h-[200px] bg-green-500 mb-4" />
        <View className="h-[200px] bg-yellow-500 mb-4" />
      </ScrollView>
    </View>
  );
}
