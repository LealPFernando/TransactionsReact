import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firesroreReducer = (state, action) => {
  switch (action.type) {
    case "ADDED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        ...state,
        document: null,
        isPending: false,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload,
        isPending: false,
        success: false,
        document: null,
      };
    case "IS_PENDING":
      return {
        ...state,
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  const [isCanceled, setIsCanceled] = useState(false);
  const [response, dispatch] = useReducer(firesroreReducer, initialState);

  // collection ref
  const ref = projectFirestore.collection(collection);

  // Only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCanceled) dispatch(action);
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({
        type: "DELETED_DOCUMENT",
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "Could not delete" });
    }
  };

  useEffect(() => {
    return () => setIsCanceled(true);
  }, []);

  return { addDocument, deleteDocument, response };
};
