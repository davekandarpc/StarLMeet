import {
  API_BASE_URL,
  NOTIFICATION_API_BASE_URL,
  AUTHORIZATION_TOKEN,
} from "../common/config.test";

const isTokenExpire = async (responseJson) => {
  const response = await responseJson;
  if (response.message === "Unauthorized request") {
    console.log("Error ");
    return;
  }
  // console.log("Response ", response);
  return response;
};

export const loginUser = async (data) => {
  return fetch(
    `${API_BASE_URL}/MobileLogin?username=${data.userName}&password=${data.password}&fcmtoken=${data.token}`,
    {
      method: "POST",
    }
  )
    .then(async (response) => response)
    .catch((error) => console.log("error", error));
};

export const userList = async (id) => {
  return fetch(`${API_BASE_URL}/MobileUserList?id=${id}`, {
    method: "POST",
  })
    .then((response) => isTokenExpire(response.json()))
    .catch((error) => console.log("error", error));
};

export const sendNotificationAPi = async (requestParams) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return fetch(`${API_BASE_URL}/notification/send`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(requestParams),
  })
    .then((response) => isTokenExpire(response.json()))
    .catch((error) => console.log("error", error));
};

export const getMessageList = async (id) => {
  return fetch(`${API_BASE_URL}/GetMessage?roomid=${id}`, {
    method: "POST",
  })
    .then((response) => response)
    .catch((error) => console.log("error", error));
};

export const sendMessage = async (requestParams) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return fetch(`${API_BASE_URL}/SendMessage`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(requestParams),
  })
    .then((response) => response)
    .catch((error) => console.log("error", error));
};
export const createVoxUser = async (requestParams) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return fetch(
    `${API_BASE_URL}/VoxCreateUser?userId=${requestParams.userId}&password=${requestParams.pass}&userdisplayname=${requestParams.displayName}`,
    {
      method: "POST",
      headers: myHeaders,
    }
  )
    .then((response) => response)
    .catch((error) => console.log("error", error));
};
export const getVoxUser = async (userName) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return fetch(`${API_BASE_URL}/VoxGetUser?user_name=${userName}`, {
    method: "POST",
    headers: myHeaders,
  })
    .then((response) => response)
    .catch((error) => console.log("error", error));
};
