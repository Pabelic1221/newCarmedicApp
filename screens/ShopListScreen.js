import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import AppBar from './AppBar'; // Import AppBar component

const ShopListScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);

    useEffect(() => {
        const fetchShops = async () => {
            const db = getFirestore();
            const q = query(collection(db, "shops")); // Assuming 'shops' is your collection
            const querySnapshot = await getDocs(q);
            const shopData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setShops(shopData);
            setFilteredShops(shopData); // Initialize with all shops
        };

        fetchShops();
    }, []);

    const handleSearch = () => {
        const results = shops.filter(shop =>
            shop.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredShops(results);
    };

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <View style={styles.iconWrapper}>
                <View style={styles.icon} />
            </View>
            <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopInfo}>{`${item.address}, ${item.reviews} reviews`}</Text>
            </View>
            <TouchableOpacity style={styles.moreIcon}>
                <Text>{'>'}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
          <AppBar />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search Shops"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredShops}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No shops found.</Text>}
            />
        </SafeAreaView>
    );
};

export default ShopListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
    },
    searchButton: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
    },
    listItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    shopDetails: {
        flex: 1,
        marginLeft: 10,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    shopInfo: {
        fontSize: 16,
        color: '#666',
    },
    moreIcon: {
        marginRight: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});
