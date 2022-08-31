// import React, { useEffect, useCallback, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   Platform,
//   KeyboardAvoidingView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { Header } from "../../components/HeaderComponent";
// import { styles } from "./styles";
// import withUser from "../../redux/HOC/withUser";
// import { sendNotification, getMessageList, sendMessage } from "../../utils/API";
// import withSelectedRoom from "../../redux/HOC/withSelectedRoom";
// import withLoader from "../../redux/HOC/withLoader";
// import InCallManager from "react-native-incall-manager";
// import Modal from "react-native-modal";
// import MaterialIcon from "react-native-vector-icons/MaterialIcons";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { colors } from "../../common/colors";
// import io from "socket.io-client";
// import {
//   RTCPeerConnection,
//   RTCSessionDescription,
//   RTCIceCandidate,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals,
// } from "react-native-webrtc";

// const SOCKET_URL = "wss://webrtc.skyrockets.space:8080";
// const ChatScreen = ({
//   route,
//   navigation,
//   user,
//   selectedRoom,
//   loader,
//   loaderState,
// }) => {
//   const [callActive, setCallActive] = useState(false);
//   const [incomingCall, setIncomingCall] = useState(false);
//   const [onCallCLick, setOnCallCLick] = useState(false);
//   const [otherId, setOtherId] = useState("");
//   const [selectedUser, setSelectedUser] = useState("");
//   const [callToUsername, setCallToUsername] = useState("");
//   const [onername, setOnername] = useState("");
//   const [ReceiverName, setReceiverName] = useState("");
//   const connectedUser = useRef(null);
//   /**call start */
//   let peerConstraints = {
//     iceServers: [
//       {
//         urls: "stun:stun.l.google.com:19302",
//       },
//     ],
//   };
//   const socketConn = useRef(new WebSocket(SOCKET_URL));
//   const pc = useRef(peerConstraints);

//   useEffect(() => {
//     socketConn.current.onopen = () => {
//       console.log("Connected to the signaling server");
//       send({
//         type: "login",
//         name: user.userName,
//       });
//       // setSocketActive(true);
//     };
//     //when we got a message from a signaling server
//     socketConn.current.onmessage = (msg) => {
//       //console.log("msg --------------------->", msg);

//       const data = JSON.parse(msg.data);
//       console.log("Data --------------------->", data);
//       switch (data.type) {
//         case "login":
//           console.log("Login dat");
//           break;
//         //when somebody wants to call us
//         case "offer":
//           // handleOffer(data.offer, data.name);
//           handleCheckOffer();
//           console.log("Offer : ", data.offer, data.name);
//           break;
//         case "answer":
//           // handleAnswer(data.answer);
//           console.log("Answer");
//           break;
//         //when a remote peer sends an ice candidate to us
//         case "candidate":
//           // handleCandidate(data.candidate);
//           console.log("Candidate");
//           break;
//         case "leave":
//           // handleLeave();
//           console.log("Leave");
//           break;
//         default:
//           break;
//       }
//     };
//     socketConn.current.onerror = function (err) {
//       console.log("Got error", err);
//     };
//     // initLocalVideo();
//     // registerPeerEvents();
//     socket();
//   }, []);
//   useEffect(() => {}, []);
//   const socket = async () => {
//     console.log("socket ");
//     let mediaConstraints = {
//       audio: true,
//       video: {
//         frameRate: 30,
//         facingMode: "user",
//       },
//     };

//     let localMediaStream;
//     let isVoiceOnly = false;

//     try {
//       const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

//       if (isVoiceOnly) {
//         let videoTrack = await mediaStream.getVideoTracks()[0];
//         videoTrack.enabled = false;
//       }

//       localMediaStream = mediaStream;
//     } catch (err) {
//       // Handle Error
//     }

//     /**init peerConstant */

//     pc.current = new RTCPeerConnection(peerConstraints);

//     //connectionstatechange
//     pc.current.addEventListener("connectionstatechange", (event) => {
//       console.log("connectionstatechange  ", event);
//       switch (pc.current.connectionState) {
//         case "closed":
//           console.log("call disconnect");
//           break;
//       }
//     });

//     //icecandidate
//     pc.current.addEventListener("icecandidate", (event) => {
//       // When you find a null candidate then there are no more candidates.
//       // Gathering of candidates has finished.
//       if (!event.candidate) {
//         return;
//       }

//       // Send the event.candidate onto the person you're calling.
//       // Keeping to Trickle ICE Standards, you should send the candidates immediately.
//     });

//     //icecandidateerror
//     pc.current.addEventListener("icecandidateerror", (event) => {
//       // You can ignore some candidate errors.
//       // Connections can still be made even when errors occur.
//     });

//     //   iceconnectionstatechange
//     pc.current.addEventListener("iceconnectionstatechange", (event) => {
//       // console.log("event iceconnectionstatechange ", event);
//       console.log("he ", pc.current.iceConnectionState);
//       switch (pc.current.iceConnectionState) {
//         case "connected":
//         case "completed":
//           // You can handle the call being connected here.
//           // Like setting the video streams to visible.

//           break;
//       }
//     });

//     pc.current.addEventListener("negotiationneeded", (event) => {
//       // You can start the offer stages here.
//       // Be careful as this event can be called multiple times.
//     });

//     pc.current.addEventListener("signalingstatechange", (event) => {
//       switch (pc.current.signalingState) {
//         case "closed":
//           // You can handle the call being disconnected here.

//           break;
//       }
//     });

//     pc.current.addEventListener("addstream", (event) => {
//       // Grab the remote stream from the connected participant.
//       remoteMediaStream = event.stream;
//     });

//     // Add our stream to the peer connection.
//     pc.current.addStream(localMediaStream);

//     let sessionConstraints = {
//       mandatory: {
//         OfferToReceiveAudio: true,
//         OfferToReceiveVideo: true,
//         VoiceActivityDetection: true,
//       },
//     };

//     try {
//       const offerDescription = await pc.current.createOffer(sessionConstraints);
//       await pc.current.setLocalDescription(offerDescription);
//       // console.log("offerDescription ", offerDescription);
//       // Send the offerDescription to the other participant.
//       send({
//         type: "offer",
//         offer: offerDescription,
//       });
//     } catch (err) {
//       console.error("err step 4 ", err);
//     }

//     // try {
//     //   // Use the received answerDescription
//     //   const answerDescription = new RTCSessionDescription(answerDescription);
//     //   await pc.current.setRemoteDescription(answerDescription);
//     // } catch (err) {
//     //   console.error("err step 7 ", err);
//     // }
//   };
//   const handleCheckOffer = async () => {
//     console.log("Got check offer handleCheckOffer answer");
//     try {
//       // Use the received offerDescription
//       const offerDescription = new RTCSessionDescription(offerDescription);
//       await pc.current.setRemoteDescription(offerDescription);

//       const answerDescription = await pc.current.createAnswer(
//         sessionConstraints
//       );
//       await pc.current.setLocalDescription(answerDescription);
//       send({
//         type: "answer",
//         answer: answerDescription,
//       });
//       // Here is a good place to process candidates.
//       processCandidates();

//       // Send the answerDescription back as a response to the offerDescription.
//     } catch (err) {
//       console.error("err step 6 ", err);
//     }
//   };
//   const send = (message) => {
//     if (connectedUser.current) {
//       message.name = connectedUser.current;
//       // //console.log("Connected iser in end----------", message);
//     }
//     // console.log("Message", message);
//     socketConn.current.send(JSON.stringify(message));
//   };

//   let remoteCandidates = [];

//   const handleRemoteCandidate = (iceCandidate) => {
//     iceCandidate = new RTCIceCandidate(iceCandidate);

//     if (pc.current.remoteDescription == null) {
//       return remoteCandidates.push(iceCandidate);
//     }

//     return pc.current.addIceCandidate(iceCandidate);
//   };

//   const processCandidates = () => {
//     if (remoteCandidates.length < 1) {
//       return;
//     }

//     remoteCandidates.map((candidate) => pc.current.addIceCandidate(candidate));
//     remoteCandidates = [];
//   };
//   /**call End */

//   const acceptCall = async () => {};
//   const handleLeave = async () => {};
//   const onEndCall = async () => {};
//   const onCall = async () => {
//     // connectedUser.current = otherUser;
//   };

//   return (
//     <View>
//       <Header
//         title={selectedUser}
//         subTitle="Er"
//         onPressBack={() => {
//           console.log("back");
//         }}
//         onPressCall={onCall}
//       />
//       <Modal isVisible={incomingCall && !callActive}>
//         <View
//           style={{
//             backgroundColor: "white",
//             padding: 22,
//             borderRadius: 4,
//             borderColor: "rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <View>
//             <Text
//               style={{ color: colors.primaryTextColor, fontWeight: "bold" }}
//             >
//               Incoming call ........
//             </Text>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 marginTop: 15,
//               }}
//             >
//               <TouchableOpacity
//                 style={styles.btnContentAccept}
//                 onPress={acceptCall}
//               >
//                 <Text style={styles.textColor}>Accept Call</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.btnContentReject}
//                 onPress={handleLeave}
//               >
//                 <Text style={styles.textColor}>Reject Call </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modal isVisible={onCallCLick}>
//         <View
//           style={{
//             backgroundColor: "white",
//             flex: 1,
//           }}
//         >
//           <View style={styles.avtarContainer}>
//             <View style={styles.maincallbtndiv}>
//               <View style={styles.callnamebtn}>
//                 <Text style={styles.callnamebtnText}>
//                   {selectedUser.substring(0)}
//                 </Text>
//               </View>
//             </View>
//           </View>
//           <View style={styles.bottomCenter}>
//             <TouchableOpacity onPress={onEndCall}>
//               <View style={styles.callbuton}>
//                 <MaterialIcon name="call" size={40} color="white" />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Header } from "../../components/HeaderComponent";
import { styles } from "./styles";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Send,
  Composer,
} from "react-native-gifted-chat";
import { colors } from "../../common/colors";
import io from "socket.io-client";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from "react-native-webrtc";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";

import { useFocusEffect } from "@react-navigation/native";

import InCallManager from "react-native-incall-manager";
import Modal from "react-native-modal";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import withUser from "../../redux/HOC/withUser";
import { sendNotification, getMessageList, sendMessage } from "../../utils/API";
import withSelectedRoom from "../../redux/HOC/withSelectedRoom";
import withLoader from "../../redux/HOC/withLoader";

// const STUN_SERVER = "stun:webrtc.skyrockets.space:3478";
const STUN_SERVER = "stun:stun.l.google.com:19302";
const SOCKET_URL = "wss://webrtc.skyrockets.space:8080";
let peer;
const ChatScreen = ({
  route,
  navigation,
  user,
  selectedRoom,
  loader,
  loaderState,
}) => {
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const other_User = useRef();
  const sendChannel = useRef();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUserName] = useState("");
  const [userName, setUserName] = useState("");
  // const { roomID } = route?.params;

  /**calling code  */
  const [userId, setUserId] = useState("");
  const [socketActive, setSocketActive] = useState(false);
  const [calling, setCalling] = useState(false);
  const [localStream, setLocalStream] = useState({ toURL: () => null });
  const [remoteStream, setRemoteStream] = useState({ toURL: () => null });

  const conn = useRef(new WebSocket(SOCKET_URL));

  const yourConn = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: STUN_SERVER,
        },
      ],
    })
  );

  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [onCallCLick, setOnCallCLick] = useState(false);
  const [otherId, setOtherId] = useState("");
  const [callToUsername, setCallToUsername] = useState("");
  const [onername, setOnername] = useState("");
  const [ReceiverName, setReceiverName] = useState("");
  const [roomID, set_RoomID] = useState("");
  const connectedUser = useRef(null);
  const offerRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      setOnername(id.trim());
    });
    AsyncStorage.getItem("sendTo").then((id) => {
      setSelectedUserName(user.userName.trim() === "smith" ? "john" : "smith");
      // setSelectedUserName(id.trim());
    });
    console.log("user data ", user.userName.trim());
  }, []);

  useEffect(() => {
    // console.log("user  ", user);

    let roomID;
    if (user.userTypeId === 2) {
      roomID = `Ad${user.id}_${selectedRoom.id}`;
    } else {
      roomID = `${user.id}_${selectedRoom.id}`;
    }
    // getMessages(roomID);
  }, [user, selectedRoom]);

  const getMessages = async (roomID) => {
    loader(true);
    const messageResponse = await getMessageList(roomID);
    // console.log("rooom Data ", messageResponse);
    const { status, data } = messageResponse;
    if (status === 200) {
      let res = await messageResponse.json();
      set_RoomID(roomID);

      let messages = res.message.replace(/'/g, '"');
      let Objs = JSON.parse(messages);
      let msgList = [];
      for (let i = 0; i < Objs.length; i++) {
        let msg = {
          text: Objs[i].message,
          user: { _id: Objs[i].userid },
          createdAt: new Date(`${Objs[i].date}`),
          _id: Math.random(1000).toString(),
        };
        // msgList.push(msg);
        loader(false);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msg)
        );
      }
      // console.log("messages ", msgList);
    } else if (status === 204) {
      loader(false);
      let newRoom = `${selectedRoom.id}_${user.id}`;
      getMessages(newRoom);
    }
  };

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userCallerId").then((id) => {
        //console.log("callingId ", user.userName.trimEnd());
        if (id) {
          setUserId(user.userName.trimEnd());
        } else {
          setUserId("");
          navigation.push("Login");
        }
      });
    }, [userId])
  );

  useEffect(() => {
    navigation.setOptions({
      title: "Your ID - " + userId,
      headerRight: () => (
        <TouchableOpacity
          mode="text"
          onPress={onLogout}
          style={{ paddingRight: 10 }}
        >
          <Text> Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [userId]);

  /**
   * Calling Stuff
   */

  useEffect(() => {
    if (socketActive && userId.length > 0) {
      try {
        InCallManager.start({ media: "audio" });
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setSpeakerphoneOn(true);
      } catch (err) {
        //console.log("InApp Caller ---------------------->", err);
      }

      send({
        type: "login",
        name: userId,
      });
      //console.log("userId ", typeof userId.trim());
    }
  }, [socketActive, userId]);

  const onLogin = () => {};

  useEffect(() => {
    conn.current.onopen = () => {
      console.log("Connected to the signaling server");
      setSocketActive(true);
    };
    //when we got a message from a signaling server
    conn.current.onmessage = (msg) => {
      //console.log("msg --------------------->", msg);

      const data = JSON.parse(msg.data);
      //console.log("Data --------------------->", data);
      switch (data.type) {
        case "login":
          console.log("Login dat");
          break;
        //when somebody wants to call us
        case "offer":
          handleOffer(data.offer, data.name);
          console.log("Offer : ", data.offer, data.name);
          break;
        case "answer":
          handleAnswer(data.answer);
          console.log("Answer");
          break;
        //when a remote peer sends an ice candidate to us
        case "candidate":
          handleCandidate(data.candidate);
          console.log("Candidate");
          break;
        case "leave":
          handleLeave();
          console.log("Leave");
          break;
        default:
          break;
      }
    };
    conn.current.onerror = function (err) {
      console.log("Got error", err);
    };
    initLocalVideo();
    registerPeerEvents();
  }, []);

  const openCallSocketConnection = () => {
    conn.current.onopen = () => {
      console.log("Connected to the signaling server");
      setSocketActive(true);
    };
    //when we got a message from a signaling server
    conn.current.onmessage = (msg) => {
      //console.log("msg --------------------->", msg);

      const data = JSON.parse(msg.data);
      console.log("Data --------------------->", data);
      switch (data.type) {
        case "login":
          //console.log("Login dat");
          break;
        //when somebody wants to call us
        case "offer":
          if (data.name === undefined) {
            data.name = selectedUser;
          }
          console.log("Offer : ", data.offer, data.name);
          handleOffer(data.offer, data.name);
          break;
        case "answer":
          handleAnswer(data.answer);
          //console.log("Answer");
          break;
        //when a remote peer sends an ice candidate to us
        case "candidate":
          handleCandidate(data.candidate);
          //console.log("Candidate");
          break;
        case "leave":
          handleLeave();
          //console.log("Leave");
          break;
        default:
          break;
      }
    };
    conn.current.onerror = function (err) {
      //console.log("Got error", err);
    };
    initLocalVideo();
    registerPeerEvents();
  };

  useEffect(() => {
    if (!callActive) {
      InCallManager.stop();
    } else {
      InCallManager.setSpeakerphoneOn(true);
    }
  }, [callActive]);

  const registerPeerEvents = () => {
    yourConn.current.onaddstream = (event) => {
      console.log("On Add Remote Stream");
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    yourConn.current.onicecandidate = (event) => {
      if (event.candidate) {
        send({
          type: "candidate",
          candidate: event.candidate,
        });
      }
    };
  };

  const initLocalVideo = () => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: "user",
          // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      })
      .then((stream) => {
        // Got stream!
        setLocalStream(stream);
        stream.getVideoTracks()[0].stop();
        // setup stream listening
        yourConn.current.addStream(stream);
      })
      .catch((error) => {
        // Log error
      });
    // });
  };

  const send = (message) => {
    //attach the other peer username to our messages
    // //console.log(
    //   "connectedUser.current iser in end----------",
    //   connectedUser.current
    // );
    if (connectedUser.current) {
      message.name = connectedUser.current;
      // //console.log("Connected iser in end----------", message);
    }
    console.log("Message", message);

    conn.current.send(JSON.stringify(message));
  };

  const onCall = () => {
    // await openCallSocketConnection();
    // socketRef.current.disconnect();
    setOnCallCLick(true);
    sendCall(selectedUser);
    setReceiverName(selectedUser);
    //console.log("her ", selectedUser);
    setTimeout(() => {
      sendCall(selectedUser);
    }, 1000);
  };

  const sendCall = (receiverId) => {
    setCalling(true);
    const otherUser = receiverId;
    connectedUser.current = otherUser;
    console.log("Caling to", otherUser);
    yourConn.current.createOffer().then((offer) => {
      // console.log("Sending Ofer 001", offer);
      yourConn.current.setLocalDescription(offer).then(() => {
        // console.log("Sending Ofer", offer);
        send({
          type: "offer",
          offer: offer,
        });
      });
    });
  };

  const sendNotification = async (message) => {
    const sendInComingCallRequest = {
      deviceId: `${selectedRoom.fcmToken}`,
      isAndroiodDevice: true,
      title: `${message}`,
      body: `${connectedUser.current} message you...`,
    };

    console.log(
      "Starting incoming call ",
      JSON.stringify(selectedRoom.fcmToken)
    );
    const notificationRes = await sendNotification(sendInComingCallRequest);

    console.log(
      "notificationRes incoming call ",
      JSON.stringify(notificationRes)
    );
  };
  //when somebody sends us an offer
  const handleOffer = async (offer, name) => {
    //console.log(name + " is calling you.");
    connectedUser.current = name;
    offerRef.current = { name, offer };
    setIncomingCall(true);
    setOtherId(name);
    // acceptCall();
    if (callActive) acceptCall();
  };

  const acceptCall = async () => {
    setOnCallCLick(true);
    const name = offerRef.current.name;
    const offer = offerRef.current.offer;
    setIncomingCall(false);
    setCallActive(true);
    console.log("Accepting CALL", name, offer);
    yourConn.current
      .setRemoteDescription(offer)
      .then(function () {
        connectedUser.current = name;
        return yourConn.current.createAnswer();
      })
      .then(function (answer) {
        yourConn.current.setLocalDescription(answer);
        send({
          type: "answer",
          answer: answer,
        });
      })
      .then(function () {
        // Send the answer to the remote peer using the signaling server
      })
      .catch((err) => {
        //console.log("Error acessing camera", err);
      });
  };

  //when we got an answer from a remote user
  const handleAnswer = (answer) => {
    setCalling(false);
    setCallActive(true);
    yourConn.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  //when we got an ice candidate from a remote user
  const handleCandidate = (candidate) => {
    setCalling(false);
    yourConn.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const onLogout = () => {
    handleLeave();
    AsyncStorage.removeItem("userId").then((res) => {
      navigation.push("Login");
    });
  };

  const rejectCall = async () => {
    send({
      type: "leave",
    });
  };

  const handleLeave = () => {
    send({
      name: userId,
      otherName: otherId,
      type: "leave",
    });
    setCalling(false);
    setIncomingCall(false);
    setCallActive(false);
    setOnCallCLick(false);
    offerRef.current = null;
    connectedUser.current = null;
    setRemoteStream(null);
    setLocalStream(null);
    yourConn.current.onicecandidate = null;
    yourConn.current.ontrack = null;
    // yourConn.curren.getTransceivers().forEach((transceiver) => {
    //   transceiver.stop();
    // });

    resetPeer();
    initLocalVideo();
    // //console.log("Onleave");
  };

  const resetPeer = () => {
    yourConn.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: STUN_SERVER,
        },
      ],
    });

    registerPeerEvents();
  };
  ///**End calling code */

  const onEndCall = () => {
    handleLeave();
  };

  return (
    <View styles={styles.mainContainer}>
      <Header
        title={selectedUser}
        subTitle="Er"
        onPressBack={() => {
          let removeData = {
            roomId: `${roomID}`,
            currentUser: `${socketRef?.current?.id}`,
          };
          socketRef?.current?.emit("left", removeData);
          socketRef?.current?.emit("user left", `${roomID}`);

          navigation.navigate("tabStck");
        }}
        onPressCall={onCall}
      />
      {/* <View style={{ height: "89%", color: "black" }}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages, roomID)}
          renderInputToolbar={(props) => MessengerBarContainer(props)}
          user={{
            _id: user.id,
          }}
          renderSend={(props) => customtSendButton(props)}
          renderBubble={(props) => renderBubble(props)}
          renderComposer={(props) => (
            <Composer
              textInputStyle={{ color: colors.primaryTextColor }}
              {...props}
            />
          )}
        />
        {Platform.OS === "android" && (
          <KeyboardAvoidingView behavior="padding" />
        )}
      </View> */}
      <Modal isVisible={incomingCall && !callActive}>
        <View
          style={{
            backgroundColor: "white",
            padding: 22,
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <View>
            <Text
              style={{ color: colors.primaryTextColor, fontWeight: "bold" }}
            >
              Incoming call ........
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                style={styles.btnContentAccept}
                onPress={acceptCall}
              >
                <Text style={styles.textColor}>Accept Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnContentReject}
                onPress={handleLeave}
              >
                <Text style={styles.textColor}>Reject Call </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal isVisible={onCallCLick}>
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
          }}
        >
          <View style={styles.avtarContainer}>
            <View style={styles.maincallbtndiv}>
              <View style={styles.callnamebtn}>
                <Text style={styles.callnamebtnText}>
                  {selectedUser.substring(0)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomCenter}>
            <TouchableOpacity onPress={onEndCall}>
              <View style={styles.callbuton}>
                <MaterialIcon name="call" size={40} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {loaderState && (
        <View style={styles.loaderContainer}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primaryColor} />
          </View>
        </View>
      )}
    </View>
  );
};

export default withUser(withSelectedRoom(withLoader(ChatScreen)));
