import { useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import Loading from "../Loading/Loading";
import Unauthorized from "../Unauthorized/Unauthorized";

export const getDataFromRaw = (rawData) => {
  const rawName = Object.keys(rawData)[0];
  return rawData[rawName];
};

export const Editor = ({ name, form, id, renameError, onUpdated, updateCache, query, children }: any) => {
  const [localId, setLocalId] = useState(id !== "create" ? id : undefined);
  const [unauthorized, setUnauthorized] = useState(false);
  const [errors, setErrors] = useState([]);

  const [storedData, setStoredData] = useState({});

  const handleError = (incommingError) => {
    let incomingErrors = incommingError.message.split("\n");
    if (renameError) {
      incomingErrors = incomingErrors.map((error) => renameError(error));
    }
    setErrors(incomingErrors);
  };

  const updateDataFromLoaded = (loadedDataRaw) => {
    if (!loadedDataRaw) {
      return;
    }

    const loadedData = getDataFromRaw(loadedDataRaw);

    if (loadedData) {
      setStoredData({ ...loadedData });
    } else {
      setUnauthorized(true);
    }
  };

  const onCompleted = (raw) => {
    const data = getDataFromRaw(raw);
    setLocalId(data.id);
    setErrors(null);
    if (onUpdated) onUpdated(raw);
  };

  const skipLoading = !localId;
  const { loading } = useQuery(query.QUERY, {
    variables: { id: localId },
    skip: skipLoading,
    onCompleted: (loadedDataRaw) => {
      updateDataFromLoaded(loadedDataRaw);
    },
    onError: (e) => {
      if (e.message === "GraphQL error: Unauhorized") {
        setUnauthorized(true);
      }
    },
  });

  const [createProjectMutation] = useMutation(query.CREATE_MUTATION, {
    errorPolicy: "none",
    onCompleted: onCompleted,
    update: updateCache,
    onError: handleError,
  });

  const [updateProjectMutation] = useMutation(query.UPDATE_MUTATION, {
    errorPolicy: "none",
    onCompleted: onCompleted,
    update: updateCache,
    onError: handleError,
  });

  // const onSubmit = (data:any) => {
  //   console.log(data)
  // }

  const onSubmit = useCallback(
    (data) => {
      if (localId) {
        setErrors(null);
        updateProjectMutation({
          variables: {
            id: localId,
            ...data,
          },
        });
      } else {
        createProjectMutation({
          variables: {
            userId: localStorage.getItem("user.id"),
            ...data,
          },
        });
      }
    },
    [localId, createProjectMutation, updateProjectMutation]
  );

  if (unauthorized) {
    return <Unauthorized where={`${name} edit`} />;
  }

  if (loading) {
    return <Loading what={name} />;
  }

  return <div className="Editor">{children(storedData, onSubmit, errors)}</div>;
};

export default Editor;
