import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { actions } from "./user"; // Assuming you have user-related actions
import { getAuth } from "firebase/auth";
export const getCurrentUser = () => {
  const auth = getAuth();
  return async (dispatch) => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        let userDocRef = doc(db, "users", currentUser.uid); // Assuming `users` collection
        let userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = {
            id: userSnapshot.id,
            ...userSnapshot.data(),
          };
          console.log("User Data: ", userData);
          dispatch(actions.setCurrentUser(userData)); // Assuming there's a setUser action
        } else {
          userDocRef = doc(db, "shops", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const userData = {
              id: userSnapshot.id,
              ...userSnapshot.data(),
            };
            console.log("User Data: ", userData);
            dispatch(actions.setCurrentUser(userData));
          } else {
            console.log("No such user document!");
          }
        }
      } else {
        console.log("No user is authenticated");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };
};
