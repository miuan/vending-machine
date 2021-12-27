import { loader } from "graphql.macro";
import React from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Control from "../../../components/Editor/Control";
import Editor from "../../../components/Editor/Editor";
import EditorApi from "../../../components/Editor/EditorApi";

const CREATE_MUTATION = loader("./graphql/mutation-create-product.gql");
const UPDATE_MUTATION = loader("./graphql/mutation-update-product.gql");
const QUERY = loader("./graphql/query-product.gql");

const renameError = (error) => {
  const dupkeyRegEx = /index: productName_1 dup key: { productName: "(.*?)"/;

  const dupkeyMatch = error.match(dupkeyRegEx);
  if (dupkeyMatch) {
    return `Field product name have to be unique, you want '${dupkeyMatch[1]}' what is already in your product list`;
  }

  return error;
};

const ProductManagerEditForm = ({ storedData, onSubmit, errors }) => {
  const reactForm = useForm();
  const { handleSubmit } = reactForm;
  return (
    <>
      {errors && <Alert variant={"danger"}>{errors.toString()}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Control name={"productName"} label={"Name"} required={true} storedData={storedData} {...reactForm} />
        <Control name={"cost"} label={"Cost"} required={true} storedData={storedData} valueAsNumber {...reactForm} />
        <Control name={"amountAvailable"} label={"Available (num of stock)"} required={false} storedData={storedData} valueAsNumber {...reactForm} />
        <Button type="submit">Save</Button>
      </Form>
    </>
  );
};

export const ProductManagerEditAPI = () => {
  const { id } = useParams();

  return (
    <EditorApi id={id} name={"Product api"} fields={["productName", "cost", "productAvailable"]} apiUrl={"/api/product"} renameError={renameError}>
      {(storedData, onSubmit, errors) => <ProductManagerEditForm storedData={storedData} onSubmit={onSubmit} errors={errors} userRoleId={id} />}
    </EditorApi>
  );
};

export const ProductManagerEditGQL = () => {
  const { id } = useParams();

  return (
    <Editor
      id={id}
      name={"Product gql"}
      fields={["productName", "cost", "productAvailable"]}
      query={{
        CREATE_MUTATION,
        UPDATE_MUTATION,
        QUERY,
      }}
    >
      {(storedData, onSubmit, errors) => <ProductManagerEditForm storedData={storedData} onSubmit={onSubmit} graphQlError={errors} userRoleId={id} />}
    </Editor>
  );
};

export const ProductManagerEdit = ({ api }) => (api ? <ProductManagerEditAPI /> : <ProductManagerEditGQL />);
export default ProductManagerEdit;
