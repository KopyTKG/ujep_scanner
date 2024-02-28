import { Text, Button, Input, theme, Block } from "galio-framework";
import React, { useState, useEffect} from "react";
import { StyleSheet, View } from "react-native";
import { Camera } from "expo-camera";

const url = "http://192.168.83.48:5000/guide"

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [user, setUser] = useState("")
  const [text, setText] = useState("")
  const [status, setStatus] = useState(0)
  const [scanned, setScanned] = useState(true);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
        qr_code: data,
      }),
    }).then(response => {
      setStatus(response.status)
    })

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

  if(user === "") {
    return <View style={styles.container}>
      <Text h4> Insert username </Text>
      <Input placeholder="stxxxxx" color={theme.COLORS.INFO} style={{ borderColor: theme.COLORS.INFO }} placeholderTextColor={theme.COLORS.INFO} onChangeText={(e) => setText(e)}/>
      <Button onPress={() => {
        setUser(text)
      }}> Login </Button>
    </View>
  }


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
      {status != 0?
        status == 402?
          <Block card>
            <Text style={{ color: theme.COLORS.WARNING }}  h5> QR has been used </Text>
          </Block> :
        status == 200?
        <Block card>
            <Text style={{ color: theme.COLORS.SUCCESS}}  h5> Succes ! </Text>
          </Block> : 
          <Block card>
            <Text style={{ color: theme.COLORS.DRIBBBLE }}  h5> Wrong QR code ! </Text>
          </Block>

      : null
      }
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
