import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { actions } from "../../../redux/requests/requests";
import PropTypes from "prop-types";

const TicketListener = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const colRef = collection(db, "requests");

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        // Map the documents to include the 'id' along with the data
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, // Add the document's id here
          ...doc.data(), // Spread the rest of the document's data
        }));

        dispatch(actions.updateRequests(data));
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
