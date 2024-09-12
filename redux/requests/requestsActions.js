import {
  getDocs,
  collection,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { actions } from "./requests";

export const getAllRequests = () => {
  return async (dispatch) => {
    try {
      const requestsCollectionRef = collection(db, "requests");

      // Query to fetch only pending and accepted requests
      const requestsQuery = query(
        requestsCollectionRef,
        where("state", "in", ["pending", "accepted"])
      );

      const querySnapshot = await getDocs(requestsQuery);

      const requests = await Promise.all(
        querySnapshot.docs.map(async (document) => {
          const request = { id: document.id, ...document.data() };

          // Fetch user's firstname and lastname using the userId from the request
          const userDocRef = doc(db, "users", request.userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const { firstName, lastName } = userDoc.data();
            return {
              ...request,
              firstName,
              lastName,
            };
          }

          return request;
        })
      );

      console.log("requests with user info: ", requests);
      dispatch(actions.setRequests(requests));
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };
};
