import { Tabs } from "expo-router";

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; //home
import FontAwesome from '@expo/vector-icons/FontAwesome'; //checkin
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; //games
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'; //ranking
import Ionicons from '@expo/vector-icons/Ionicons'; //settings

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: "#07575B"}}> 

      <Tabs.Screen name="index" options={{title: "Home",
        tabBarIcon: ({color}) => 
        <FontAwesome5 name="home" size={24} color={color} />
      }}/>
      
      <Tabs.Screen name="checkin" options={{title: "Check-in",
        tabBarIcon: ({color}) => 
        <FontAwesome name="check-square-o" size={24} color={color} />
      }}/>

      <Tabs.Screen name="games" options={{title: "Matches",
        tabBarIcon: ({color}) => 
        <MaterialCommunityIcons name="badminton" size={24} color={color} />
      }}/>

      <Tabs.Screen name="ranking" options={{title: "Ranking", 
        tabBarIcon: ({color}) => 
        <FontAwesome6 name="ranking-star" size={24} color={color} />
      }}/>
      
      <Tabs.Screen name="setting" options={{title: "Setting",
        tabBarIcon: ({color}) => 
        <Ionicons name="settings-sharp" size={24} color={color} />
      }
      }/>

    </Tabs>
  );
}
