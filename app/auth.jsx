import {useAuth} from "../lib/auth-context";
import {useState} from "react";
import { useRouter } from "expo-router";
import {KeyboardAvoidingView, Platform,View, StyleSheet} from "react-native";
import {Text, TextInput, Button, useTheme} from "react-native-paper"; 

export default function AuthScreen() {
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const theme = useTheme();
  const router = useRouter();
  const {signUp, signIn} = useAuth();


  const handleAuth = async () => {
    if(!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setError("null");
    
    if(isSignUp){
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    }else{
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
      router.replace("/home");
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">{isSignUp ? "Vamos criar sua conta!" : "Que bom te ver de novo"}</Text>

        <TextInput 
          style={styles.input}
          label= "Email" 
          autoCapitalize="none" 
          keyboardType="email-address"
          placeholder="Enter your email"
          mode="outlined"
          onChangeText={setEmail}
        />

        <TextInput 
          style={styles.input}
          label= "Password" 
          autoCapitalize="none" 
          keyboardType="default"
          mode="outlined"
          secureTextEntry={true}  
          onChangeText={setPassword}
        />
        
        {error &&(
          <Text style={{color:theme.colors.error}}>{error}</Text>
        )}

        <Button style={styles.button} mode="contained" onPress={handleAuth}>{isSignUp ? "Cadastrar" : "Entrar"}</Button>
        <Button style={styles.swtchModeButton} mode="text" onPress={handleSwitchMode}>
          {isSignUp ? "Voltou? Entre aqui!" : "Novo por aqui? Crie sua conta!"}
        </Button>
      
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title:{
    textAlign: "center",
    marginBottom: 24,
  },
  input:{
    textAlign: "center",
    marginBottom: 16,
  },
  button:{
    marginTop: 8,
  },
  swtchModeButton: {
    marginTop: 16,
    
  }
});