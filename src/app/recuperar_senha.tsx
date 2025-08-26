import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  SafeAreaView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { cssInterop } from "nativewind";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";

cssInterop(TextInput, { className: "style" });

// URL da API
const API_URL = "http://150.161.61.1:8083";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [code, setCode] = useState(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setIsCodeVerified(false);
    setEmail("");
    setCode(new Array(6).fill(""));
    setNewPassword("");
    setConfirmPassword("");
    router.push("/sing-in");
  };

  const handleSubmitEmail = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu e-mail.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setIsSubmitted(true);
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? typeof error.response.data === "string"
            ? error.response.data
            : "Não foi possível enviar o e-mail."
          : "Não foi possível conectar ao servidor. Verifique sua rede.";
      Alert.alert("Erro", errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const finalCode = code.join("");
    if (finalCode.length < 6) {
      Alert.alert("Erro", "O código deve ter 6 dígitos.");
      return;
    }
    setIsVerifying(true);
    try {
      await axios.post(`${API_URL}/auth/verify-code`, {
        email: email,
        token: finalCode,
      });
      setIsCodeVerified(true);
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? typeof error.response.data === "string"
            ? error.response.data
            : "Código inválido ou expirado."
          : "Não foi possível conectar ao servidor.";
      Alert.alert("Erro de Verificação", errorMessage);
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert(
        "Senha curta",
        "A nova senha deve ter pelo menos 6 caracteres."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    setIsUpdating(true);
    const finalCode = code.join("");
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email: email,
        token: finalCode,
        newPassword: newPassword,
      });
      Alert.alert(
        "Sucesso!",
        "Sua senha foi atualizada. Por favor, faça o login.",
        [{ text: "OK", onPress: handleBackToLogin }]
      );
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? typeof error.response.data === "string"
            ? error.response.data
            : "Não foi possível atualizar a senha."
          : "Não foi possível conectar ao servidor.";
      Alert.alert("Erro", errorMessage);
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    if (text === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // --- TELA 3: REDEFINIR SENHA ---
  if (isCodeVerified) {
    return (
      <SafeAreaView className="flex-1 bg-white-500">
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          extraScrollHeight={Platform.OS === "ios" ? 80 : 40}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            <View className="bg-primary-500 px-6 pt-16 pb-8 rounded-b-3xl">
              <View className="flex-row items-center mb-6">
                <TouchableOpacity
                  onPress={() => setIsCodeVerified(false)}
                  className="mr-4"
                >
                  <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white-500 text-sm font-medium">
                  LINFEDEMAPP
                </Text>
              </View>
              <Text className="text-white-500 text-3xl font-bold">
                Nova senha
              </Text>
            </View>

            <View className="px-6 py-8 flex-1">
              <Text className="text-gray-600 leading-relaxed mb-8">
                Quase pronto! Digite sua nova senha para finalizar a
                recuperação.
              </Text>

              <View className="space-y-6">
                {/* Nova Senha */}
                <View>
                  <Text className="text-gray-700 font-medium mb-3">
                    Nova senha
                  </Text>
                  <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                    <Feather name="lock" size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 h-14 ml-3 text-gray-700"
                      placeholder="Digite sua nova senha"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Feather
                        name={showNewPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirmar Senha */}
                <View>
                  <Text className="text-gray-700 font-medium mb-3">
                    Confirmar senha
                  </Text>
                  <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                    <Feather name="lock" size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 h-14 ml-3 text-gray-700"
                      placeholder="Confirme sua nova senha"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Feather
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>
                  {newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword && (
                      <Text className="text-primary-500 text-sm mt-2">
                        As senhas não coincidem.
                      </Text>
                    )}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleUpdatePassword}
                disabled={
                  isUpdating ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                className="w-full py-4 bg-primary-500 rounded-xl mt-8 items-center justify-center disabled:opacity-50"
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white-500 font-bold text-base">
                    Atualizar senha
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View className="items-center pb-8 px-6">
              <TouchableOpacity>
                <Text className="text-primary-500 font-medium">
                  Preciso de ajuda
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  // --- TELA 2: VERIFICAR CÓDIGO ---
  if (isSubmitted) {
    const finalCode = code.join("");
    return (
      <SafeAreaView className="flex-1 bg-white-500">
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          extraScrollHeight={Platform.OS === "ios" ? 80 : 40}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            <View className="bg-primary-500 px-6 pt-16 pb-8 rounded-b-3xl">
              <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={handleBackToLogin} className="mr-4">
                  <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white-500 text-sm font-medium">
                  LINFEDEMAPP
                </Text>
              </View>
              <Text className="text-white-500 text-3xl font-bold">
                Digite o código
              </Text>
            </View>

            <View className="px-6 py-8 items-center flex-1">
              <View className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Feather name="check-circle" size={40} color="#16a34a" />
              </View>
              <Text className="text-xl font-semibold text-gray-800 mb-4">
                Verifique seu e-mail
              </Text>
              <Text className="text-gray-600 mb-2 text-center">
                Enviamos um código de verificação para:
              </Text>
              <Text className="text-primary-500 font-medium mb-8">{email}</Text>

              <Text className="text-gray-700 font-medium mb-3">
                Código de verificação
              </Text>
              <View className="flex-row justify-between w-full max-w-xs">
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    className="w-12 h-14 bg-gray-100 rounded-lg text-2xl text-center font-bold text-gray-700 border border-gray-200 focus:border-primary-500"
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleVerifyCode}
                disabled={isVerifying || finalCode.length < 6}
                className="w-full py-4 bg-primary-500 rounded-xl mt-8 items-center justify-center disabled:opacity-50"
              >
                {isVerifying ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white-500 font-bold text-base">
                    Verificar código
                  </Text>
                )}
              </TouchableOpacity>

              <View className="mt-8 flex-row justify-center">
                <Text className="text-gray-600">Não recebeu o código? </Text>
                <TouchableOpacity onPress={() => setIsSubmitted(false)}>
                  <Text className="text-primary-500 font-medium">
                    Enviar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="items-center pb-8 px-6">
              <TouchableOpacity>
                <Text className="text-primary-500 font-medium">
                  Preciso de ajuda
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  // --- TELA 1: DIGITAR E-MAIL ---
  return (
    <SafeAreaView className="flex-1 bg-white-500">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === "ios" ? 80 : 40}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1">
          <View className="bg-primary-500 px-6 pt-16 pb-8 rounded-b-3xl">
            <View className="flex-row items-center mb-6">
              <TouchableOpacity onPress={handleBackToLogin} className="mr-4">
                <Feather name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white-500 text-sm font-medium">
                LINFEDEMAPP
              </Text>
            </View>
            <Text className="text-white-500 text-3xl font-bold">
              Esqueceu a senha?
            </Text>
          </View>

          <View className="flex-1 px-6 py-8">
            <Text className="text-gray-600 leading-relaxed mb-8">
              Digite seu e-mail e enviaremos as instruções de recuperação.
            </Text>
            <View>
              <Text className="text-gray-700 font-medium mb-3">E-mail</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <Feather name="mail" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 h-14 ml-3 text-gray-700"
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmitEmail}
                disabled={isLoading || !email.trim()}
                className="w-full py-4 bg-primary-500 rounded-xl mt-8 items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white-500 font-bold text-base">
                    Enviar instruções
                  </Text>
                )}
              </TouchableOpacity>

              <View className="mt-8 flex-row justify-center">
                <Text className="text-gray-600">Lembrou da senha? </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text className="text-primary-500 font-medium">
                    Entrar agora
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="items-center pb-8 px-6">
            <TouchableOpacity>
              <Text className="text-primary-500 font-medium">
                Preciso de ajuda
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}