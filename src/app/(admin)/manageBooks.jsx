import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import Ginf from "../../../components/ui/Ginf/Ginf";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Redirect } from "expo-router";
import AcceptBook from "../../../components/AcceptBook";
// import { FlatList } from "react-native-gesture-handler";
import { useEditPostContext } from "../context/EditPostContext";

const { width, height } = Dimensions.get("window");

export default function ManageBooks() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL
    // const {books, setBooks} = useEditPostContext()
    const [books, setBooks] = useState([]);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const { authState } = useAuth();
    const router = useRouter();
    const { colors } = useTheme();
    // console.log(authState);

    const getBooks = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/books?status=check&currentPage=1&amount=1000`
            );
            if (response.status !== 200) {
                console.log("błąd pobierania ogłoszeń do akceptacji");
            }
            // console.log(response.data.books);
            setBooks(response.data.books);
            setIsDownloaded(true);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        getBooks();
    }, []);

    if (authState.role !== "admin") {
        return <Redirect href="/(tabs)/home" />;
    }
    const handleRemoveBook = (postId) => {
        console.log(books);
        setBooks((prevState) => prevState.filter((post) => post._id !== postId));
    };
    return (
        <View
            className="bg-black relative"
            style={{ width, height, paddingBottom: 80 }}>
            <View
                className="w-full bg-black border-b border-neutral-600 py-2"
                style={{ elevation: 4 }}>
                <View className="flex flex-row items-center justify-between px-3">
                    <View>
                        <Text
                            style={{ color: colors.text }}
                            className="font-GilroySemiBold py-2 text-2xl">
                            Książki do zaakceptowania
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ginf name="arrowBack" size={38} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {isDownloaded ? books?.length > 0 ? (
            <View>
                <FlatList
                    data={books}
                    renderItem={({ item }) => (
                        <AcceptBook
                            colors={colors}
                            key={item.id}
                            book={item}
                            handleRemoveBook={handleRemoveBook}
                        />
                    )}
                    keyExtractor={(item, index) => item.id + index.toString()}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>

            ) : (
                <View className="flex justify-center items-center" style={{ paddingTop: 40 }}>
                    <Text style={{ color: colors.text}} className="font-GilroyMedium text-xl">Brak postów do zaakceptowania</Text>
                </View>
                
            ) : (
                <View  className="flex justify-center items-center" style={{ paddingTop: 40 }}>
                    <Text style={{ color: colors.text}} className="font-GilroyMedium text-xl">Ładowanie...</Text>
                </View>
            )}
        </View>
    );
}
