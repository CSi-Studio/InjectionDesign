import ProForm, {ModalForm} from '@ant-design/pro-form';
import {Button} from 'antd';
import {DeviceFields} from '@/domains/Device.d';
import type {Device} from '@/domains/Device.d';
import {EditOutlined} from "@ant-design/icons";
import {FormattedMessage} from 'umi';

export function buildCreateModal(createFormRef: any, doCreate: any) {
  return (
    <ModalForm
      key="create"
      formRef={createFormRef}
      width={640}
      layout={'horizontal'}
      labelCol={{span: 6}}
      wrapperCol={{span: 16}}
      title={<FormattedMessage id='create.instrument'/>}
      trigger={
        <Button key="add" type="primary">
          <FormattedMessage id='create.instrument'/>
        </Button>
      }
      modalProps={{destroyOnClose: true, maskClosable: false}}
      onFinish={doCreate}
    >
      {DeviceFields.name()}
      {DeviceFields.deviceModel()}
      {DeviceFields.deviceType()}
      {DeviceFields.owner()}
      {DeviceFields.upLoadOtherMaterial()}
      {DeviceFields.uploadTrainingMaterial()}
      {DeviceFields.mainParam()}
    </ModalForm>
  );
}

export function buildUpdateModal(updateFormRef: any, doUpdate: any, device: Device) {
  return (
    <ModalForm
      formRef={updateFormRef}
      autoFocusFirstInput
      title={<FormattedMessage id='update.instrument'/>}
      trigger={
        <a><EditOutlined/><FormattedMessage id='update'/></a>
      }
      width={370}
      modalProps={{destroyOnClose: true}}
      onFinish={doUpdate}
    >
      <ProForm.Group>
        {DeviceFields.id(device.id, true)}
        {DeviceFields.createDate(device.createDate, true)}
        {DeviceFields.name(device.name, false)}
        {DeviceFields.owner(device.owner, false)}
        {DeviceFields.deviceModel(device.deviceModel, false)}
        {DeviceFields.deviceType(device.deviceType, false)}
        {DeviceFields.remindInfo(device.remindInfo, false)}
        {DeviceFields.mainParam(device.mainParam, false)}
      </ProForm.Group>
    </ModalForm>
  );
}

export function buildConfigModal(updateFormRef: any, device: Device) {
  return (
    <ModalForm
      formRef={updateFormRef}
      autoFocusFirstInput
      title={<FormattedMessage id='parts.info'/>}
      trigger={
        <Button size={'small'} type={'primary'}><EditOutlined/><FormattedMessage id='parts.info'/></Button>
      }
      width={1200}
      modalProps={{destroyOnClose: true}}
    >
      <ProForm.Group>
        {DeviceFields.id(device.id, true)}
        {DeviceFields.createDate(device.createDate, true)}
        {DeviceFields.name(device.name, false)}
        {DeviceFields.owner(device.owner, false)}
        {DeviceFields.deviceModel(device.deviceModel, false)}
        {DeviceFields.deviceType(device.deviceType, false)}
        {DeviceFields.remindInfo(device.remindInfo, false)}
        {DeviceFields.mainParam(device.mainParam, false)}
      </ProForm.Group>
    </ModalForm>
  );
}
