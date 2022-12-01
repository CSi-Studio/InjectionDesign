import { DeviceType, SampleBoardType, SupportPlatForm } from '@/components/Enums/Const';
import { ProFormDateTimePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import {FormattedMessage} from "@@/exports";

export const MSOrderFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="工单id" />
  ),
  name: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="name" label="工单名称" />
  ),

  device: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="sm"
      name="sampleArrangementType"
      label={<FormattedMessage id='sample.arrangement.type'/>}
      valueEnum={DeviceType}
    />
  ),
  runSampleMethod: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="sm"
      name="runSampleMethod"
      label={<FormattedMessage id='plate.type'/>}
      valueEnum={SampleBoardType}
    />
  ),
  runSample: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          message: 'required',
        },
      ]}
      width="md"
      name="runSample"
      label={<FormattedMessage id='samples.total'/>}
    />
  ),
  checkPlatform: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          message: 'required',
        },
      ]}
      width="md"
      name="checkPlatform"
      label={<FormattedMessage id='analytical.platform'/>}
      valueEnum={SupportPlatForm}
    />
  ),
  owner: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="owner"
      label={<FormattedMessage id='owner'/>}
    />
  ),

  status: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      width="md"
      name="status"
      label={<FormattedMessage id='status'/>}
    />
  ),

  createDate: (value: any, readonly: boolean) => (
    <ProFormDateTimePicker
      initialValue={value}
      readonly={readonly}
      width="sm"
      name="createDate"
      label={<FormattedMessage id='create.date'/>}
    />
  ),
  lastModifiedDate: (value: any, readonly: boolean) => (
    <ProFormDateTimePicker
      initialValue={value}
      readonly={readonly}
      width="sm"
      name="lastModifiedDate"
      label={<FormattedMessage id='update.date'/>}
    />
  ),
};

export type MSOrder = {
  id: string;
  name: string;
  device: string;
  runSampleMethod: string;
  runSample: string;
  checkPlatform: string;
  owner: string;
  status: string;
  createDate: string;
  lastModifiedDate: string;
};

export type MsOrderSample = {
  id: string;
  sampleId: string;
  sampleNo: string;
  sampleStatus: string;
  groupName: string;
  runSamplePosition: string;
  runSampleType: string;
  sampleType: string;
  injectionOrder: string;
  injectionPosition: string;
  device: string;
  fileName: string;
  collectMethod: string;
  dataSavePath: string;
  createDate: string;
  comment: string;
  platform: string,
  lastModifiedDate: string;
}
