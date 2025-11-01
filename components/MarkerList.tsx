import { MarkerMap } from '@/types';
import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    markers: MarkerMap[];
    onMarkerPress: (marker: MarkerMap) => void;
    onMarkerDelete?: (marker: MarkerMap) => void;
    onMarkerEdit?:(markerId: number, newTitle: string, newDescription: string) => void;
    emptyText?: string;
}

export default function MarkerListComponent({markers, onMarkerPress, onMarkerDelete, onMarkerEdit, emptyText = 'Нет добавленных маркеров'}:Props) {
    const [editingMarker, setEditingMarker] = useState<MarkerMap | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    if(markers.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
        );
    };
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    };

    const handleEditPress = (marker: MarkerMap) => {
        setEditingMarker(marker);
        setEditTitle(marker.title || '');
        setEditDescription(marker.description || '');
    };

    const handleSaveEdit = () => {
        if (editingMarker && onMarkerEdit) {
            if (!editTitle.trim()) {
                Alert.alert('Ошибка', 'Название не может быть пустым');
                return;
            }
            onMarkerEdit(editingMarker.id, editTitle.trim(), editDescription.trim());
            setEditingMarker(null);
            setEditTitle('');
            setEditDescription('');
        }
    };

    const handleCancelEdit = () => {
        setEditingMarker(null);
        setEditTitle('');
        setEditDescription('');
    };


    return (
        <View style={styles.container}>
        <ScrollView>
            {markers.map(marker => (
                <View key={marker.id} style={styles.markerItem}>
                    <TouchableOpacity
                        style={styles.markerContent}
                        onPress={() => onMarkerPress(marker)}
                    >
                        <View style={styles.markerInfo}>
                            <Text style={styles.markerTitle}>
                                {marker.title || `Маркер ${marker.id}`}
                            </Text>
                            <Text style={styles.markerDescription}>
                                {marker.description || 'Без описания'}
                            </Text>
                            <Text style={styles.markerCoordinates}>
                                {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                            </Text>
                            <Text style={styles.markerDate}>
                                Создан: {formatDate(marker.createAt)}
                            </Text>
                        </View>

                    </TouchableOpacity>
                    
                    <View style={styles.actionsContainer}>
                        {onMarkerEdit && (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleEditPress(marker)}
                            >
                                <Text style={styles.editButtonText}>✏️</Text>
                            </TouchableOpacity>
                        )}
                        {onMarkerDelete && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => onMarkerDelete(marker)}
                            >
                                <Text style={styles.deleteButtonText}>×</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </View>
            ))}
        </ScrollView>
            <Modal
                visible={!!editingMarker}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCancelEdit}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Редактировать маркер</Text>
                        
                        <Text style={styles.inputLabel}>Название</Text>
                        <TextInput
                            style={styles.textInput}
                            value={editTitle}
                            onChangeText={setEditTitle}
                            placeholder="Введите название"
                            maxLength={50}
                        />
                        
                        <Text style={styles.inputLabel}>Описание</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={editDescription}
                            onChangeText={setEditDescription}
                            placeholder="Введите описание"
                            multiline
                            numberOfLines={3}
                            maxLength={200}
                        />
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handleCancelEdit}
                            >
                            <Text style={styles.cancelButtonText}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveEdit}
                            >
                            <Text style={styles.saveButtonText}>Сохранить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    markerItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    markerContent: {
        flex: 1,
    },
    markerInfo: {
        flex: 1,
    },
    markerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    markerDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    markerCoordinates: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    markerDate: {
        fontSize: 11,
        color: '#999',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    editButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        backgroundColor: '#FF9500',
        borderRadius: 16,
        marginRight: 8,
    },
    editButtonText: {
        fontSize: 14,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        backgroundColor: '#FF3B30',
        borderRadius: 16,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})