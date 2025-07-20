## BIBLIOTECAS INSTALADAS

### TAILWIND
npm install nativewind react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
npm install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11




### SUPABASE AUTH
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage @rneui/themed react-native-url-polyfill

OBSERVAÇÃO: TEM CONFLITO COM RNEUI(SAFETY AREA VERSÃO 5.0, MAS A VERSÃO RNEUI SÓ SUPORTA ATÉ 4.0.0)

SOLUÇÃO: "ABAIXAR" A VERSÃO ESTÁVEL 4.0.0
npx expo install react-native-safe-area-context@4.0.0
npx expo install @rneui/themed

AFTER COMPLETE:
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

## NÃO FOI POSSÍVEL INSTALAR
npx expo install @rneui/themed@3.4.2
npx expo install @rneui/themed@4.0.0

VERSÃO RNEUI: @rneui/themed@4.0.0-rc.8
## REMOVER A VERSÃO
npm uninstall @rneui/themed
npx expo install @rneui/themed@latest

## ÚTLIMO COMANDO (UFA!)
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage @rneui/themed react-native-url-


npm uninstall @rneui/themed
npx expo install react-native-safe-area-context@latest


## INSTALL APPWRITE
npx expo install react-native-appwrite react-native-url-polyfill

## INSTALL 
npx expo install react-native-paper