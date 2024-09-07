import { getDocs, getDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { actions } from "./shops";
export const getAllShops = () => {
  return async (dispatch) => {
    try {
      const shopsCollectionRef = collection(db, "shops");
      const querySnapshot = await getDocs(shopsCollectionRef);
      const shops = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Shops: ", shops);
      dispatch(actions.setShops(shops));
    } catch (error) {
      console.error("Error fetching shops: ", error);
    }
  };
};
