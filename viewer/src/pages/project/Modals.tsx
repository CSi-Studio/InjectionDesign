import ProForm, {ModalForm} from '@ant-design/pro-form';
import type {Project} from '@/domains/Project.d';
import {ProjectFields} from '@/domains/Project.d';
import {Button} from 'antd';
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import { FormattedMessage } from 'umi';

export function buildCreateModal(createFormRef: any, doCreate: any) {
  return (
    <ModalForm
      key="create"
      formRef={createFormRef}
      title={<FormattedMessage id='create.project'/>}
      trigger={

        <Button key="add" type="primary">
          <PlusOutlined/> <FormattedMessage id='create'/>
        </Button>
      }
      width={640}
      layout={'horizontal'}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      modalProps={{ destroyOnClose: true, maskClosable: false }}
      onFinish={doCreate}
    >
      {ProjectFields.name()}
      {ProjectFields.alias()}
      {ProjectFields.owner()}
    </ModalForm>
  );
}

export function buildUpdateModal(updateFormRef: any, doUpdate: any, project: Project) {
  return (
    <ModalForm
      key={"updateModal"}
      formRef={updateFormRef}
      autoFocusFirstInput
      title={<FormattedMessage id='update.project'/>}
      trigger={
        <a><EditOutlined/> Update</a>
      }
      width={400}
      modalProps={{destroyOnClose: true}}
      onFinish={doUpdate}
    >
      <ProForm.Group>
        {ProjectFields.id(project.id, true)}
        {ProjectFields.createDate(project.createDate, true)}
        {ProjectFields.lastModifiedDate(project.lastModifiedDate, true)}
        {ProjectFields.name(project.name, false)}
        {ProjectFields.alias(project.alias, false)}
        {ProjectFields.owner(project.owner, false)}
      </ProForm.Group>
    </ModalForm>
  );
}
