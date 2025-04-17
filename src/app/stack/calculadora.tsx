import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Calculadora() {
    return (
        <View className="flex-1 bg-white-500 px-6 py-10">
            <Text className="text-black-500 font-bold mb-6">Calculadora</Text>
            {/* Aqui você pode adicionar os componentes da calculadora */}
            <Text>Calculadora em construção...</Text>
            <Link href="/stack/home" className="text-primary-500 font-bold mt-4">
                Voltar para Home
            </Link>
            <Link href="/stack/bracoAfetado" className="text-primary-500 font-bold mt-4">
                Ir para Braço Afetado
            </Link>
            <Link href="/stack/bracoRef" className="text-primary-500 font-bold mt-4">
                Ir para Braço Não Afetado
            </Link>
        </View>
    );
}