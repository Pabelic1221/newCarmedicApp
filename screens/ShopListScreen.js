import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import AppBar from './AppBar'; // Import AppBar component

const ShopListScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);

    useEffect(() => {
        const fetchShops = async () => {
            const db = getFirestore();
            const q = query(collection(db, "shops"));
            const querySnapshot = await getDocs(q);
            const shopData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Fetched Shops:", shopData); // Debug: Check what is fetched
            setShops(shopData);
            filterShops(shopData, searchTerm); // Initialize with all shops or filter based on searchTerm
        };

        fetchShops();
    }, []);

    useEffect(() => {
        filterShops(shops, searchTerm);
    }, [searchTerm]); // React to changes in searchTerm

    const filterShops = (shops, term) => {
        if (term) {
            const filtered = shops.filter(shop =>
                shop.shopName && shop.shopName.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredShops(filtered);
        } else {
            setFilteredShops(shops); // Show all shops if no searchTerm
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <View style={styles.iconWrapper}>
                <View style={styles.icon} />
            </View>
            <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{item.shopName ? item.shopName : 'Unnamed Shop'}</Text>
                <Text style={styles.shopInfo}>
                    {item.address ? `${item.address}, ` : 'N/A, '}
                    {item.reviews ? `${item.reviews} reviews` : '0 reviews'}
                </Text>
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
