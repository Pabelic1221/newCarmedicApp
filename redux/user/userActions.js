import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { actions } from "./user"; // Assuming you have user-related actions
import { getAuth } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
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
export const updateUserStatus = (userId, status) => async (dispatch) => {
  try {
    console.log("USER UPDATE", userId);

    // First, try to get the user document from the 'users' collection
    let userDocRef = doc(db, "users", userId);
    let userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      // If user document exists, update the status
      await updateDoc(userDocRef, {
        status: status,
      });
      console.log("User status updated in 'users' collection");
    } else {
      // If not found in 'users', try the 'shops' collection
      userDocRef = doc(db, "shops", userId);
      const shopSnapshot = await getDoc(userDocRef);

      if (shopSnapshot.exists()) {
        // If shop document exists, update the status
        await updateDoc(userDocRef, {
          status: status,
        });
        console.log("User status updated in 'shops' collection");
      } else {
        console.log("No such user or shop document!");
      }
    }
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};
