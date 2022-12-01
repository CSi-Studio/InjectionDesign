import ProForm, { ModalForm } from '@ant-design/pro-form';
import { Button, Tag } from 'antd';
import { SpeciesFields, MatrixFields } from '@/domains/Config.d';
import {EditOutlined} from "@ant-design/icons";
//@ts-ignore
import {FormattedMessage} from "umi";

export function buildSpeciesCreateModal(doCreate: any) {
  return (
    <ModalForm
      key="create"
      title={<FormattedMessage id='create.species'/>}
      trigger={<Button type="primary"><FormattedMessage id='create.species'/></Button>}
      width={350}
      modalProps={{ destroyOnClose: true }}
      onFinish={doCreate}
    >
      <ProForm.Group>{SpeciesFields.speciesNo()}</ProForm.Group>
      <ProForm.Group>{SpeciesFields.speciesName()}</ProForm.Group>
      <ProForm.Group>{SpeciesFields.speciesAlias()}</ProForm.Group>
    </ModalForm>
  );
}

export function buildMatrixCreateModal(doCreate: any) {
  return (
    <ModalForm
      key="create"
      title={<FormattedMessage id='create.matrix'/>}
      trigger={<Button type="primary"><FormattedMessage id='create.matrix'/></Button>}
      width={350}
      modalProps={{ destroyOnClose: true }}
      onFinish={doCreate}
    >
      <ProForm.Group>{MatrixFields.matrixNo()}</ProForm.Group>
      <ProForm.Group>{MatrixFields.matrixName()}</ProForm.Group>
      <ProForm.Group>{MatrixFields.matrixAlias()}</ProForm.Group>
    </ModalForm>
  );
}

export function editSpeciesModal(record: any, doEdit: any) {
  return (
    <ModalForm
      key="edit"
      title={<FormattedMessage id='update.species'/>}
      trigger={
        <a><EditOutlined /><FormattedMessage id='update.species'/></a>
      }
      width={350}
      modalProps={{ destroyOnClose: true }}
      onFinish={async (params) => {
        const newParams = { ...params };
        newParams.id = record.id;
        doEdit(newParams);
        return true;
      }}
      initialValues={record}
    >
      <ProForm.Group>{SpeciesFields.speciesNo()}</ProForm.Group>
      <ProForm.Group>{SpeciesFields.speciesName()}</ProForm.Group>
      <ProForm.Group>{SpeciesFields.speciesAlias()}</ProForm.Group>
    </ModalForm>
  );
}

export function editMatrixModal(record: any, doEdit: any) {
  return (
    <ModalForm
      key="edit"
      title={<FormattedMessage id='update.matrix'/>}
      trigger={
        <Tag
          style={{
            cursor: 'pointer',
          }}
          key="edit"
          color="green"
        >
          <FormattedMessage id='update.matrix'/>
        </Tag>
      }
      width={350}
      modalProps={{ destroyOnClose: true }}
      onFinish={async (params) => {
        const newParams = { ...params };
        newParams.id = record.id;
        doEdit(newParams);
        return true;
      }}
      initialValues={record}
    >
      <ProForm.Group>{MatrixFields.matrixNo()}</ProForm.Group>
      <ProForm.Group>{MatrixFields.matrixName()}</ProForm.Group>
      <ProForm.Group>{MatrixFields.matrixAlias()}</ProForm.Group>
    </ModalForm>
  );
}
