import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { useApiGet, useApiPost, useApiUpdate } from "../../app/api-hooks";
import Loading from "../Loading/Loading";
import Unauthorized from "../Unauthorized/Unauthorized";

export const getDataFromRaw = (rawData) => {
  const rawName = Object.keys(rawData)[0];
  return rawData[rawName];
};

export const EditorApi = ({ name, form, id, renameError, onUpdated, updateCache, query, children, apiUrl }) => {
  const [localId, setLocalId] = useState(id !== "create" ? id : undefined);
  const [unauthorized, setUnauthorized] = useState(false);
  const [errors, setErrors] = useState();

  const [storedData, setStoredData] = useState({});
  const history = useHistory();

  const handleError = (incommingError) => {
    let incomingErrors = incommingError.split("\n");
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
    history.goBack();
  };

  const skipLoading = !localId;
  const { loading } = useApiGet(`${apiUrl}/${localId}`, {
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

  const [createProjectMutation] = useApiPost(apiUrl, {
    errorPolicy: "none",
    onCompleted: onCompleted,
    update: updateCache,
    onError: handleError,
  });

  const [updateProjectMutation] = useApiUpdate(apiUrl, {
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

export default EditorApi;
