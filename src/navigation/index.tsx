import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, StyleSheet } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import ClothingManagementScreen from "../screens/ClothingManagementScreen";
import ClothingDetailScreen from "../screens/ClothingDetailScreen";
import OutfitManagementScreen from "../screens/OutfitManagementScreen";
import OutfitCanvasScreen from "../screens/OutfitCanvasScreen";
import OutfitDetailScreen from "../screens/OutfitDetailScreen";
import OutfitPlanScreen from "../screens/OutfitPlanScreen";
import SelectOutfitModalScreen from "../screens/SelectOutfitModalScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { palette, spacing, fontFamily, fontSize } from "../styles/theme";
import {
  RootStackParamList,
  MainTabParamList,
  ClosetStackParamList,
  OutfitStackParamList,
  PlanStackParamList,
  ProfileStackParamList,
} from "../types/navigation";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const ClosetStack = createNativeStackNavigator<ClosetStackParamList>();
const OutfitStack = createNativeStackNavigator<OutfitStackParamList>();
const PlanStack = createNativeStackNavigator<PlanStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Stack Navigators
const ClosetStackNavigator = () => (
  <ClosetStack.Navigator screenOptions={{ headerShown: false }}>
    <ClosetStack.Screen name="ClothingManagement" component={ClothingManagementScreen} />
    <ClosetStack.Screen name="ClothingDetail" component={ClothingDetailScreen} />
  </ClosetStack.Navigator>
);

const OutfitStackNavigator = () => (
  <OutfitStack.Navigator screenOptions={{ headerShown: false }}>
    <OutfitStack.Screen name="OutfitManagement" component={OutfitManagementScreen} />
    <OutfitStack.Screen name="OutfitCanvas" component={OutfitCanvasScreen} />
    <OutfitStack.Screen name="OutfitDetail" component={OutfitDetailScreen} />
  </OutfitStack.Navigator>
);

const PlanStackNavigator = () => (
  <PlanStack.Navigator screenOptions={{ headerShown: false }}>
    <PlanStack.Screen name="OutfitPlan" component={OutfitPlanScreen} />
  </PlanStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: palette.rose_deep,
      tabBarInactiveTintColor: palette.ink_faint,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarIconStyle: styles.tabBarIcon,
    }}
  >
    <Tab.Screen
      name="Closet"
      component={ClosetStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="wardrobe" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Outfits"
      component={OutfitStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="style" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Plan"
      component={PlanStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        <RootStack.Group screenOptions={{ presentation: "modal" }}>
          <RootStack.Screen name="ClothingDetailModal" component={ClothingDetailScreen} />
          <RootStack.Screen name="OutfitDetailModal" component={OutfitDetailScreen} />
          <RootStack.Screen name="SelectOutfitModal" component={SelectOutfitModalScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 90 : 64,
    paddingBottom: Platform.OS === "ios" ? 32 : spacing.md,
    paddingTop: spacing.md,
    backgroundColor: palette.shell,
    borderTopColor: palette.line,
    borderTopWidth: 1,
    elevation: 0,
  },
  tabBarLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
  },
  tabBarIcon: {
    marginTop: spacing.xs,
  },
});

export default AppNavigator;
