import { Text, View, SafeAreaView} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import {React, use, useRef, useState} from "react";
import { Button } from "@react-navigation/elements";


export default function Index() {
  const {signOut} = useAuth();
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text>Hello</Text>
      <Button mode="text" onPress={signOut} icon={"logout"}>Sign Out</Button>
    </SafeAreaView>
  );
}
