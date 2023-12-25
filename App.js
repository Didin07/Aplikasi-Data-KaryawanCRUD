import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';

export default function MyForm() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [sallary, setSallary] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Panggil fungsi untuk mengambil data dari API saat komponen di-mount
    fetchData();
  }, []);

  

  const fetchData = async () => {
    try {
      // Ganti URL di bawah dengan URL API yang sesuai
      const response = await fetch('https://658017246ae0629a3f54505a.mockapi.io/Api/employee');
      const result = await response.json();

      // Set data yang diambil dari API ke dalam state
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


const handleAdd = async () => {
  if (name === '' || sallary === '') {
    alert('Nama dan Sallary tidak boleh kosong!');
  } else {
    try {
      // Kirim data baru ke API
      const response = await fetch('https://658017246ae0629a3f54505a.mockapi.io/Api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, sallary }),
      });

      // Ambil hasil dari respon API jika perlu
      const result = await response.json();

      // Update data setelah menambahkan data baru
      setData([...data, result]);

      // Bersihkan input setelah menambahkan data
      setName('');
      setSallary('');

      // Tampilkan alert bahwa form telah terisi dengan benar
      alert('Terima Kasih Data Berhasil diisi!');
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }
};



const handleUpdate = async () => {
  try {
    // Kirim permintaan update ke API berdasarkan ID
    const response = await fetch(`https://658017246ae0629a3f54505a.mockapi.io/Api/employee/${selectedItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, sallary }),
    });

    // Ambil hasil dari respon API jika perlu
    const updatedItem = await response.json();

    // Update data setelah mengupdate data
    setData(data.map(item => (item.id === updatedItem.id ? updatedItem : item)));

    // Sembunyikan modal setelah mengupdate data
    setIsModalVisible(false);

    // Tampilkan alert bahwa data berhasil diupdate
    alert('Data berhasil diupdate!');
  } catch (error) {
    console.error('Error updating data:', error);
  }
};

const handleDelete = async () => {
  try {
    // Kirim permintaan hapus ke API berdasarkan ID
    await fetch(`https://658017246ae0629a3f54505a.mockapi.io/Api/employee/${selectedItem.id}`, {
      method: 'DELETE',
    });

    // Update data setelah menghapus data
    setData(data.filter(item => item.id !== selectedItem.id));

    // Sembunyikan modal setelah menghapus data
    setIsModalVisible(false);

    // Tampilkan alert bahwa data berhasil dihapus
    alert('Data berhasil dihapus!');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
};


  useEffect(() => {
    if(!isModalVisible){
      setName(''); setSallary('');
    }
  },[isModalVisible])

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setSallary(item.sallary);
    setIsModalVisible(true);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aplikasi Data Karyawan PT.Nahkoda Nusantara</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Sallary"
        value={sallary}
        onChangeText={(text) => setSallary(text)}
      />
      <Button title="Tambah data" onPress={handleAdd} />

    
      <ScrollView style={styles.flatList}>
      {data.map(item => (
        <TouchableOpacity key={item.id} onPress={() => openUpdateModal(item)}>
        <View style={styles.listItem} key={item.id}>
          <Text style={styles.listItemName}>{item.name}</Text>
          <Text>${item.sallary}</Text>
        </View>
        </TouchableOpacity>
      ))}
      </ScrollView>
      

      {/* Modal untuk update atau tambah */}
      <Modal
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View>
          <Text style={styles.title}>Update Karyawan</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Sallary"
            value={sallary}
            onChangeText={(text) => setSallary(text)}
          />
          </View>
          <View>
            <View style={{marginBottom: 10}}> 
            <Button title="Update" onPress={handleUpdate} color="green"/>
            </View>

          <Button title="Delete" onPress={handleDelete} color="red" />
          <TouchableOpacity style={styles.buttonCancel} onPress={() => {setIsModalVisible(false); }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    paddingTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  modalContainer: {
    paddingTop: 50,
    height: "100%",
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  flatList: {
    // borderColor: 'gray',
    // borderWidth: 1,
    marginTop: 20
  },
  listItem:{
    marginTop: 10,
    padding: 10,
    borderColor: '#ccc', // Border color
    borderWidth: 1, // Border width
    borderRadius: 8, // Border radius
  },
  listItemName:{
    fontSize:18,
    fontWeight:"bold"
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonCancel: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold',
  }
});
