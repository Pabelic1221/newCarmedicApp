import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebase"; // Import auth from firebase config
import { actions } from "../../../redux/requests/requests";
import PropTypes from "prop-types";

const TicketListener = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser; // Get current authenticated user

    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    const storeId = currentUser.uid; // Use the current user's UID as storeId

    const colRef = collection(db, "requests");

    // Query to fetch only pending and accepted requests where userId is the current storeId
    const requestsQuery = query(
      colRef,
      where("state", "in", ["pending", "accepted"]),
      where("storeId", "==", storeId) // Filter by the current storeId
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      async (snapshot) => {
        try {
          // Fetch requests with user details
          const requests = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fetch user details for each request
          const requestsWithUserDetails = await Promise.all(
            requests.map(async (request) => {
              const userDocRef = doc(db, "users", request.userId);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                const { firstName, lastName, email } = userDoc.data();
                return {
                  ...request,
                  firstName,
                  lastName,
                  email,
                };
              }

              // If user document does not exist, return request without user details
              return request;
            })
          );

          dispatch(actions.updateRequests(requestsWithUserDetails));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};

TicketListener.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TicketListener;
