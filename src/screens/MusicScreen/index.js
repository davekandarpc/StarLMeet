import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconIonicons from "react-native-vector-icons/Ionicons";
import Sound from "react-native-sound";

export default function MusicScreen({ navigation, route }) {
  const [callOngoing, setCallOngoing] = useState(false);
  const [speakerStatus, setSpeakerStatus] = useState(false);
  const [muteStatus, setMuteStatus] = useState(false);
  const [musicOngoing, setMusicOngoing] = useState(false);
  const [listIndex, setListIndex] = useState();
  const refTemp = useRef(null);

  const DATA = [
    {
      id: 1,
      title: "Arabic Kuthu",
      isRequire: true,
      url: require("../../assest/Arabic_Kuthu.mp3"),
    },
    {
      id: 2,
      title: "Barsaat Ho Jaaye",
      isRequire: true,
      url: require("../../assest/Barsaat_Ho_Jaaye.mp3"),
    },
    {
      id: 3,
      title: "Dhokha",
      isRequire: true,
      url: require("../../assest/Dhokha.mp3"),
    },
    {
      id: 4,
      title: "Dil Galti Kar Baitha Hai",
      isRequire: true,
      url: require("../../assest/Dil_Galti_Kar_Baitha_Hai.mp3"),
    },
    {
      id: 5,
      title: "Galliyan Returns",
      isRequire: true,
      url: require("../../assest/Galliyan_Returns.mp3"),
    },
    {
      id: 6,
      title: "Hum Nashe Mein Toh Nahin",
      isRequire: true,
      url: require("../../assest/Hum_Nashe_Mein_Toh_Nahin.mp3"),
    },
    {
      id: 7,
      title: "Kesariya",
      isRequire: true,
      url: require("../../assest/Kesariya.mp3"),
    },
    {
      id: 8,
      title: "Mast Nazron Se",
      isRequire: true,
      url: require("../../assest/Mast_Nazron_Se.mp3"),
    },
    {
      id: 9,
      title: "Mehbooba Main Teri Mehbooba",
      isRequire: true,
      url: require("../../assest/Mehbooba_Main_Teri_Mehbooba.mp3"),
    },
    {
      id: 10,
      title: "Meri Zindagi Hai Tu",
      isRequire: true,
      url: require("../../assest/Meri_Zindagi_Hai_Tu.mp3"),
    },
    {
      id: 11,
      title: "Nain Ta Heere",
      isRequire: true,
      url: require("../../assest/Nain_Ta_Heere.mp3"),
    },
    {
      id: 12,
      title: "Raatan Lambiyan",
      isRequire: true,
      url: require("../../assest/Raatan_Lambiyan.mp3"),
    },
    {
      id: 13,
      title: "Saami Saami",
      isRequire: true,
      url: require("../../assest/Saami_Saami.mp3"),
    },
    {
      id: 14,
      title: "Srivalli",
      isRequire: true,
      url: require("../../assest/Srivalli.mp3"),
    },
    {
      id: 15,
      title: "Tumse Pyaar Karke",
      isRequire: true,
      url: require("../../assest/Tumse_Pyaar_Karke.mp3"),
    },
  ];

  const playSound = (item, index) => {
    console.log("for loop", index);
    setListIndex(index);
    for (let i = 0; i < DATA.length; i++) {
      console.log("for loop", i, index);
      if (i === index) {
        setMusicOngoing(true);
        console.log("first");
        refTemp.current = new Sound(item.url, (error, sound) => {
          console.log("second", refTemp.current);
          if (error) {
            alert("error: ", error);
            return;
          }
          refTemp.current.play(() => {
            console.log("third");
            refTemp.current.release();
          });
        });
      }
      if (i !== index) {
        refTemp.current.pause();
      }
    }
  };

  const stopSound = (item, index) => {
    console.log("index: ", refTemp.current);
    for (let i = 0; i < DATA.length; i++) {
      if (i === index) {
        console.log("music paused");
        setMusicOngoing(false);
        refTemp.current.pause();
      }
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.musicListMainView} key={index}>
      <TouchableOpacity style={styles.musicFilesView}>
        <IconIonicons name="ios-musical-notes" size={40} color="black" />
        <Text style={styles.nameText}>{item.title}</Text>
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
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
    width: "80%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  playPauseView: {
    width: "20%",
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
