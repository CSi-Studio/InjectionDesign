import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-form';
import { Tag, Button } from 'antd';
import type { Platform } from '@/domains/Platform.d';
import { PlatformFields } from '@/domains/Platform.d';
//@ts-ignore
import { FormattedMessage } from 'umi';

export function buildCreateModal(createFormRef: any, doCreate: any) {
  return (
    <ModalForm
      key="create"
      formRef={createFormRef}
      title={<FormattedMessage id='create.platform'/>}
      layout={'horizontal'}
      labelCol={{span: 6}}
      wrapperCol={{span: 16}}
      trigger={
        <Button key="add" type="primary">
          <FormattedMessage id='create.platform'/>
        </Button>
      }
      width={640}
      modalProps={{ destroyOnClose: true }}
      onFinish={doCreate}
    >
      <ProFormText
        rules={[{ required: true, message: 'required' }]}
        width="md"
        name="name"
        label={<FormattedMessage id='name'/>}
        tooltip="Unique"
        placeholder="Demo：pos"
      />
        {PlatformFields.device()}
        {PlatformFields.mathPath()}
        {PlatformFields.msFilePath()}
        {PlatformFields.owner()}
        {PlatformFields.sopFile()}
    </ModalForm>
  );
}

export function buildUpdateModal(updateFormRef: any, doUpdate: any, platform: Platform) {
  return (
    <ModalForm
      formRef={updateFormRef}
      autoFocusFirstInput
      title={<FormattedMessage id='update.platform'/>}
      trigger={
        <Tag
          style={{
            cursor: 'pointer',
          }}
          color="green"
        >
          <FormattedMessage id='update'/>
        </Tag>
      }
      width={370}
      modalProps={{ destroyOnClose: true }}
      onFinish={doUpdate}
    >
      <ProForm.Group>
        {PlatformFields.id(platform.id, true)}
        {PlatformFields.createDate(platform.createDate, true)}
        {PlatformFields.name(platform.name, false)}
        {PlatformFields.device(platform.device, false)}
        {PlatformFields.deviceStatus(platform.status, false)}
        {PlatformFields.mathPath(platform.mathPath, false)}
        {PlatformFields.msFilePath(platform.msFilePath, false)}
        {PlatformFields.owner(platform.owner, false)}
        {PlatformFields.sopFile(platform.sopFile, false)}
      </ProForm.Group>
    </ModalForm>
  );
}
