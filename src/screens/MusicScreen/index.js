import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  PermissionsAndroid,
} from "react-native";
import IconIonicons from "react-native-vector-icons/Ionicons";
import Sound from "react-native-sound";
import MusicFiles from "react-native-get-music-files";
// import Permissions from "react-native-permissions";

export default function MusicScreen({ navigation, route }) {
  const [musicOngoing, setMusicOngoing] = useState(false);
  const [listIndex, setListIndex] = useState();
  const [storagePermission, setStoragePermission] = useState();
  const [musicFiles, setMusicFiles] = useState([]);
  const refTemp = useRef(null);

  const playSound = (item, index) => {
    console.log("item: ", item);
    setListIndex(index);
    for (let i = 0; i < musicFiles.length; i++) {
      if (i === index) {
        refTemp?.current?.pause();
        setMusicOngoing(true);
        refTemp.current = new Sound(
          item.path,
          Sound.MAIN_BUNDLE,
          (error, sound) => {
            console.log("second", refTemp.current);
            if (error) {
              alert("error: ", error);
              return;
            }
            refTemp.current?.play(() => {
              refTemp?.current?.release();
            });
          }
        );
      }
    }
  };

  const stopSound = (item, index) => {
    console.log("refTemp.current: ", refTemp.current);
    for (let i = 0; i < musicFiles.length; i++) {
      if (i === index) {
        console.log("music paused");
        setMusicOngoing(false);
        refTemp?.current?.pause();
      }
    }
  };

  const getAssets = async () => {
    await MusicFiles.getAll({
      fields: [
        "title",
        "artwork",
        "duration",
        "artist",
        "genre",
        "lyrics",
        "albumTitle",
      ],
    })
      .then((tracks) => {
        console.log("tracks: ", tracks);
        if (tracks !== "Something get wrong with musicCursor") {
          setMusicFiles([...tracks]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION,
        {
          title: "Permission for reading audio files on your device",
          message:
            "To listen to your local audio files " +
            "please grant permission of your devise's storage",
          buttonNeutral: "Not Right Now!",
          buttonNegative: "Cancel",
          buttonPositive: "Alright",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Storage access is granted");
        getAssets();
      } else {
        console.log("Permission of storage is denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    // componentDidMount();
    requestStoragePermission();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.musicListMainView} key={index}>
      <TouchableOpacity style={styles.musicFilesView}>
        <IconIonicons name="ios-musical-notes" size={40} color="black" />
        <Text style={styles.nameText} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
      {!musicOngoing && (
        <TouchableOpacity
          style={styles.playPauseView}
          onPress={() => {
            return playSound(item, index);
          }}
        >
          <IconIonicons name="ios-play-circle-sharp" size={30} color="black" />
        </TouchableOpacity>
      )}
      {musicOngoing &&
        (listIndex === index ? (
          <TouchableOpacity
            style={styles.playPauseView}
            onPress={() => {
              return stopSound(item, index);
            }}
          >
            <IconIonicons name="stop" size={30} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.playPauseView}
            onPress={() => {
              return playSound(item, index);
            }}
          >
            <IconIonicons
              name="ios-play-circle-sharp"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        ))}
    </View>
  );

  return (
    <View style={styles.mainView}>
      <View style={styles.settingsBtnMainView}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <IconIonicons name="settings-sharp" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.musicFilesMainView}>
        <Text style={styles.titleText}>Songs:</Text>
        <FlatList
          data={musicFiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
          style={styles.flatListStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: "100%",
    paddingTop: 20,
    paddingBottom: 60,
    backgroundColor: "#000",
  },

  root: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },

  inputField: {
    marginBottom: 10,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    width: "100%",
    opacity: 1,
  },

  numberText: {
    color: "#fff",
    fontSize: 30,
  },

  titleText: {
    width: "100%",
    color: "#fff",
    fontSize: 20,
    marginBottom: 25,
  },

  flatListStyle: {
    width: "100%",
    color: "#fff",
    fontSize: 20,
    marginBottom: 10,
  },

  nameText: {
    color: "#000",
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 10,
  },

  acceptRejectText: {
    color: "#fff",
    fontSize: 20,
  },

  callMainView: {
    height: "100%",
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  settingsBtnMainView: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  mainCallBtnDiv: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  musicFilesMainView: {
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  musicListMainView: {
    // height: 50,
    width: "100%",
    color: "#000",
    fontSize: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "white",
    marginBottom: 15,
  },

  musicFilesView: {
    width: "75%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  playPauseView: {
    width: "25%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },

  acceptRejectMainView: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },

  callBtn: {
    backgroundColor: "#3478f6",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },

  endCallMainCallBtnDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    alignItems: "center",
  },

  muteMicSpeakerBtn: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },

  micSpeakerBtn: {
    backgroundColor: "transparent",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },

  endCallButton: {
    backgroundColor: "#af0009",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },

  endCallButton: {
    backgroundColor: "#af0009",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },
});
