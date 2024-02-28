import { Text, Button } from "galio-framework";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  async function Permission() {
    await Camera.requestCameraPermissionsAsync();
    setHasPermission(true);
  }

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text h3>Rights not found </Text>
        <Text>This application requires camera permissions  </Text>
        <Button onPress={() => Permission()}>Add camera rights </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text h3>UJEP Scanner </Text>
      {scanned ? <View style={styles.cameraContainer}></View> : renderCamera()}
      {scanned ? (
        <Button color="success" round size="large" onPress={() => setScanned(false)}>Start scanning </Button>
      ) : (
        <Button color="#FF5733" round size="large" onPress={() => setScanned(true)}>Stop scanning </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    width: "80%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
});
