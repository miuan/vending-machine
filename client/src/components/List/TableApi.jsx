import React, { useState } from "react";
import { Table as BTable } from "react-bootstrap";
import { useApiDelete, useApiGet } from "../../app/api-hooks";
import DeleteModal from "../DeleteModal/DeleteModal";
import Loading from "../Loading/Loading";
import Unauthorized from "../Unauthorized/Unauthorized";
import { ListRow } from "./Row";

export const TableApi = ({ filter, name, adminMode = false, queries, fields, onEdit, getEditLink, apiUrl }) => {
  const [unauthorized, setUnauthorized] = useState(false);
  const [deleteObject, setDeleteObject] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingOnDeleteDialog, setDeletingOnDeleteDialog] = useState(false);

  const [data, setData] = useState([]);
  const [error, setError] = useState();

  const { refetch, loading } = useApiGet(`${apiUrl}/all`, {
    onError: (e) => {
      if (e.message === "GraphQL error: Unauhorized") {
        setUnauthorized(true);
      } else {
        setError(e);
      }
    },
    onCompleted: (d) => {
      const dataFields = Object.getOwnPropertyNames(d);
      if (dataFields.length > 0 && d[dataFields[0]].length > 0) {
        setData(d[dataFields[0]]);
      } else {
        setData([]);
      }
    },
    variables: { filter },
  });

  const [deleteProjectMutation] = useApiDelete(`${apiUrl}/`, {
    errorPolicy: "none",
    onCompleted: (data) => {
      onHideDidaloDelete();
      refetch();
    },
    onError: (e) => {
      if (e.message === "GraphQL error: Unauhorized") {
        setUnauthorized(true);
      }
    },
  });

  const onHideDidaloDelete = () => {
    setShowDeleteDialog(false);
    setDeleteObject(null);
  };

  const onDelete = (obj) => {
    setDeletingOnDeleteDialog(false);
    setShowDeleteDialog(true);
    setDeleteObject(obj);
  };

  const doDelete = (deleteObject) => {
    setDeletingOnDeleteDialog(true);
    deleteProjectMutation({
      variables: {
        id: deleteObject.id,
      },
    });
  };

  if (unauthorized) {
    return <Unauthorized where={name} />;
  }
  if (loading) return <Loading what={name} />;

  return (
    <div>
      {error && <div>{`Error! ${error.message}`}</div>}

      <BTable responsive>
        <thead>
          <tr>
            <th>Id</th>
            {fields?.map((f) => f !== "id" && <th>{f.name ? f.name : f}</th>)}
            {adminMode && <th>User</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length &&
            data.map((projectItem) => (
              <ListRow
                name={name}
                item={projectItem}
                onDelete={onDelete}
                fields={fields}
                showDelete={true}
                onEdit={onEdit}
                getEditLink={getEditLink}
              />
            ))}
        </tbody>
      </BTable>

      <DeleteModal
        show={showDeleteDialog}
        onHide={onHideDidaloDelete}
        onDelete={doDelete}
        modelName={name}
        deleteObject={deleteObject}
        deleting={deletingOnDeleteDialog}
      />
    </div>
  );
};

export default TableApi;
