import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { getCurrentUser } from "../../redux/user/userActions";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
export default function SessionChecker({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          signOut(auth);
          Alert.alert(
            "Email not verified",
            "Please verify your email before logging in."
          );
        } else if (user.emailVerified) {
          dispatch(getCurrentUser());
        }
      }
    });
    return unsubscribe;
  }, [dispatch, onAuthStateChanged]);
  return children;
}
SessionChecker.propTypes = {
  children: PropTypes.node.isRequired,
};
