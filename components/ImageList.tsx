import { MarkerImage } from "@/types";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    images: MarkerImage[];
    onImageDelete: (ImageId: number) => void;
    onAddImage?: () => void;
    loading: boolean;
    emptyText?: string;
}

export default function ImageListComponent({images, onImageDelete, onAddImage, loading = false, emptyText = "Нет добавленных изображений"}: Props) {
    const handleDeletePress = (imageId: number) => {
        Alert.alert(
            'Удалить изображение',
            'Вы уверены, что хотите удалить изображение',
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => onImageDelete(imageId), 
                },
            ]
        );
    };
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <View style={styles.container}>
            {onAddImage && (
                <View style={styles.header}>
                    <Text style={styles.title}>Изображения</Text>
                    <TouchableOpacity 
                        style={[styles.addButton, loading && styles.disabledButton]}
                        onPress={onAddImage}
                        disabled={loading}
                    >
                        <Text style={styles.addButtonText}>
                            {loading? 'Загрузка...': 'Добавить'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        {images.length === 0? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
        ) : (
            <ScrollView
                style={styles.imagesScroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imagesGrid}>
                    {images.map(image => (
                        <View key={image.id} style={styles.imageCard}>
                            <Image 
                                source={{ uri: image.uri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.imageInfo}>
                                <Text style={styles.imageDate}>
                                    {formatDate(image.createAt)}
                                </Text>
                                {image.width && image.height && (
                                    <Text>
                                        {image.width}×{image.height}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => handleDeletePress(image.id)}
                            >
                                <Text style={styles.deleteButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        )}
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    imagesScroll: {
        flex: 1,
    },
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    imageCard: {
        width: '48%',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    imageInfo: {
        paddingHorizontal: 4,
    },
    imageDate: {
        fontSize: 11,
        color: '#666',
        marginBottom: 2,
    },
    imageDimensions: {
        fontSize: 10,
        color: '#888',
        fontFamily: 'monospace',
    },
    deleteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF3B30',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
})
