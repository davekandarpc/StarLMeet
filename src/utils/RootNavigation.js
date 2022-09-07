import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef && navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.log("navigationRef.isReady is not ready");
  }
}
