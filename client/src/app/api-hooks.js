import axios from "axios";
import { useEffect, useState } from "react";
import { getGraphqlMonsterClientAppRoot } from "./utils";

export const useApiGet = (url, { onError, onCompleted, variables, skip } = { skip: false }) => {
  const [loading, setLoading] = useState(false);

  const refetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...variables,
        filter: variables.filter ? JSON.stringify(variables.filter) : undefined,
      });
      const urlParams = params.toString() ? `?${params.toString()}` : "";
      const fullUrl = `${getGraphqlMonsterClientAppRoot()}${url}${urlParams}`;
      console.log(fullUrl, urlParams, params);
      const { data } = await axios.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user.token")}`,
        },
      });

      onCompleted(data);
    } catch (ex) {
      onError(ex);
    } finally {
      setLoading(false);
    }
  };

  const commit = () => !skip && refetch();

  useEffect(commit, [variables.filter, skip]);
  return { loading, refetch };
};

export const useApiPost = (url, { onError, onCompleted }) => {
  const [loading, setLoading] = useState(false);

  const commit = async ({ variables }) => {
    setLoading(true);

    // const id = variables.id;
    // delete variables.id;

    try {
      const { data } = await axios.post(`${getGraphqlMonsterClientAppRoot()}${url}`, variables, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user.token")}`,
        },
      });

      onCompleted(data);
    } catch (ex) {
      const error = ex.response?.data?.error?.error || ex.message;
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  //useEffect(refetch, [variables.filter]);
  return [commit];
};

export const useApiUpdate = (url, { onError, onCompleted }) => {
  const [loading, setLoading] = useState(false);

  const commit = async ({ variables }) => {
    setLoading(true);

    const id = variables.id;
    delete variables.id;

    try {
      const { data } = await axios.put(`${getGraphqlMonsterClientAppRoot()}${url}/${id}`, variables, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user.token")}`,
        },
      });

      onCompleted(data);
    } catch (ex) {
      const error = ex.response?.data?.error?.error || ex.message;
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  //useEffect(refetch, [variables.filter]);
  return [commit];
};

export const useApiDelete = (url, { onError, onCompleted }) => {
  const [loading, setLoading] = useState(false);

  const commit = async ({ variables }) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${getGraphqlMonsterClientAppRoot()}${url}${variables.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user.token")}`,
        },
      });

      onCompleted(data);
    } catch (ex) {
      onError(ex);
    } finally {
      setLoading(false);
    }
  };

  //useEffect(refetch, [variables.filter]);
  return [commit];
};
