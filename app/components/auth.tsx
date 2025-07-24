import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  AppState,
  AppStateStatus,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text, List, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

type Institute = { id: number; name: string };
const SKILL_LEVELS = ['Beginner', 'Basic', 'Intermediate', 'Advanced'];

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nusp, setNusp] = useState('');
  const [access_key, setAccessKey] = useState('');

  const [skillLevel, setSkillLevel] = useState('');
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);

  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isRegisterReady = !!(email && password && name && nusp && skillLevel && selectedInstitute && access_key);
  const isLoginReady = !!(email && password);

  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchInstitutes = async () => {
      const { data, error } = await supabase.from('institutes').select('id, name').order('name');
      if (error) Alert.alert('Falha ao carregar institutos', error.message);
      else setInstitutes(data || []);
    };
    fetchInstitutes();
  }, []);

const handleLogin = async () => {
  if (!isLoginReady) {
    Alert.alert('Falta informação', 'Email e senha são obrigatórios.');
    return;
  }
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) Alert.alert('Erro no login', error.message);
  else Alert.alert('Sua sessão foi iniciada com sucesso!');
  setLoading(false);
};

const handleRegister = async () => {
  if (!isRegisterReady) {
    Alert.alert('Por favor preencha todos os campos.');
    return;
  }

  setLoading(true);

  try {
    const trimmedKey = access_key.trim().normalize('NFC');
    console.log('[DEBUG] Chave sendo verificada:', trimmedKey);
    console.log('[DEBUG] Chave (códigos unicode):', [...trimmedKey].map(c => c.charCodeAt(0)));

    // 1. Debug: Listar todas as chaves disponíveis
    const { data: allKeys, error: allKeysError } = await supabase
      .from('corresp')
      .select('access_key')
      .order('access_key');

    if (allKeysError) {
      console.error('[DEBUG] Erro ao buscar todas as chaves:', allKeysError);
    }

    console.log('[DEBUG] Todas as chaves disponíveis (com códigos):');
    console.table(
      (allKeys || []).map(k => ({
        key: k.access_key,
        length: k.access_key.length,
        codes: [...k.access_key].map(c => c.charCodeAt(0)),
      }))
    );
    
    console.table(
  (allKeys || []).map(k => ({
    key: k.access_key,
    length: k.access_key.length,
    codes: [...k.access_key].map(c => c.charCodeAt(0)).join(','),
  }))
);

    // 2. Verificação da chave específica com .ilike (mais tolerante que .eq)
    const { data: correspData, error: correspError } = await supabase
      .from('corresp')
      .select('access_key')
      .ilike('access_key', trimmedKey)
      .maybeSingle();

    console.log('[DEBUG] Resultado da verificação:', {
      chaveProcurada: trimmedKey,
      encontrada: correspData ? 'SIM' : 'NÃO',
      erro: correspError,
      chaveRetornada: correspData ? correspData.access_key : 'N/A',
    });

    if (correspError) {
      console.error("Erro na consulta de chave:", correspError);
      Alert.alert('Erro', 'Ocorreu um erro ao verificar a chave. Tente novamente.');
      setLoading(false);
      return;
    }

    if (!correspData) {
      Alert.alert(
        'Chave inválida',
        `A chave "${trimmedKey}" não foi encontrada. Verifique se digitou corretamente ou se há espaços/caracteres especiais.`
      );
      setLoading(false);
      return;
    }

    // 3. Cadastra usuário no Auth
    const { data: { session }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !session?.user) {
      console.error("Erro no cadastro do usuário:", signUpError?.message || 'Nenhuma sessão retornada');
      Alert.alert('Erro no Cadastro', signUpError?.message || 'Nenhuma sessão retornada após o cadastro. Tente novamente.');
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    // 4. Insere dados do perfil
    const { error: insertError } = await supabase.from('profiles').insert({
      id: userId,
      name,
      nusp,
      skill_level: skillLevel,
      institute_id: selectedInstitute.id,
    });

    if (insertError) {
      console.error("Erro ao salvar perfil:", insertError.message);
      Alert.alert('Erro ao salvar perfil', `Ocorreu um erro ao salvar suas informações de perfil: ${insertError.message}`);

      // Tenta deletar usuário criado se perfil falhou (Edge Function/Server necessário se não for admin)
      await supabase.auth.admin.deleteUser(userId);
    } else {
      Alert.alert(
        session ? 'Cadastro realizado com sucesso!' : 'Verifique seu e-mail',
        session ? 'Bem-vindo ao app!' : 'Verifique seu e-mail para ativar sua conta e prosseguir com o login.'
      );
    }
  } catch (error) {
    console.error("Erro geral no processo de cadastro:", error);
    Alert.alert('Erro Inesperado', 'Ocorreu um erro inesperado durante o cadastro. Por favor, tente novamente.');
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        {mode === 'login' ? 'Sign In' : 'Register'}
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />

      {mode === 'register' && (
        <>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="NUSP"
            value={nusp}
            onChangeText={setNusp}
            keyboardType="numeric"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Chave de Acesso"
            value={access_key}
            onChangeText={setAccessKey}
            style={{ marginBottom: 10 }}
          />

          <Button
            mode="outlined"
            onPress={() => setShowSkillModal(true)}
            style={{ marginBottom: 10 }}
          >
            {skillLevel ? `Skill Level: ${skillLevel}` : 'Select Skill Level'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => setShowInstituteModal(true)}
            style={{ marginBottom: 20 }}
          >
            {selectedInstitute ? selectedInstitute.name : 'Select Institute'}
          </Button>
        </>
      )}

      <Button
        mode="contained"
        onPress={mode === 'login' ? handleLogin : handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator animating size="small" /> : mode === 'login' ? 'Sign In' : 'Register'}
      </Button>

      <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={{ marginTop: 20, textAlign: 'center', color: '#007AFF' }}>
          {mode === 'login'
            ? "Don't have an account? Register"
            : 'Already have an account? Sign in'}
        </Text>
      </TouchableOpacity>

      {/* Skill Modal */}
      <Modal visible={showSkillModal} animationType="slide" onRequestClose={() => setShowSkillModal(false)}>
        <FlatList
          data={SKILL_LEVELS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <List.Item
              title={item}
              onPress={() => {
                setSkillLevel(item);
                setShowSkillModal(false);
              }}
            />
          )}
        />
      </Modal>

      {/* Institute Modal */}
      <Modal visible={showInstituteModal} animationType="slide" onRequestClose={() => setShowInstituteModal(false)}>
        <FlatList
          data={institutes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              onPress={() => {
                setSelectedInstitute(item);
                setShowInstituteModal(false);
              }}
            />
          )}
        />
      </Modal>
    </ScrollView>
  );
}
