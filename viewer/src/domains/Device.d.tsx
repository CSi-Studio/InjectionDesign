import {DeviceType} from '@/components/Enums/Const';
import {
  ProFormText,
  ProFormDateTimePicker,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormSelect,
} from '@ant-design/pro-form';
//@ts-ignore
import { FormattedMessage } from 'umi';
import DevicePartService from "@/services/DevicePartService";
new DevicePartService();
export const DeviceFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID"/>
  ),

  name: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{required: true, message: 'required'}]}
      width="md"
      name="name"
      label={<FormattedMessage id='name'/>}
      tooltip="Unique"
      placeholder="Demo: HFX-1"
      valueEnum={DeviceType}
    />
  ),

  deviceModel: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="deviceModel"
      label={<FormattedMessage id='model'/>}
      placeholder={"Input"}
    />
  ),

  deviceType: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="deviceType"
      label={<FormattedMessage id='type'/>}
      placeholder={"Input"}
    />
  ),

  mainParam: (value: any, readonly: boolean) => (
    <ProFormTextArea
      initialValue={value}
      readonly={readonly}
      width="md"
      name="mainParam"
      label={<FormattedMessage id='main.params'/>}
      placeholder={"Input"}
    />
  ),

  owner: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: '1-50 characters are appropriate',
        },
      ]}
      width="md"
      name="owner"
      label={<FormattedMessage id='owner'/>}
      placeholder={"Input"}
    />
  ),
  trainingMaterial: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: '1-50 characters are appropriate',
        },
      ]}
      width="md"
      name="createBy"
      label={<FormattedMessage id='training.materials'/>}
    />
  ),

  otherMaterial: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="otherMaterial"
      label={<FormattedMessage id='other.materials'/>}
    />
  ),

  remindInfo: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="remindInfo"
      label={<FormattedMessage id='remind.info'/>}
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
      label={<FormattedMessage id='update.materials'/>}
    />
  ),
  upLoadOtherMaterial: (value: any, readonly: boolean) => (
    <ProFormUploadButton
      name="otherMaterial"
      label={<FormattedMessage id='training.materials'/>}
      title={<FormattedMessage id='please.upload.file'/>}
      max={1}
      fieldProps={{
        name: 'file',
        method: 'POST',
        onChange: (info: any) => {
          console.log(info);
        },
        beforeUpload: (file: any) => {
          console.log(file);
        },
      }}
      action="/upload.do"
      extra="Support for pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar"
    />
  ),
  uploadTrainingMaterial: (value: any, readonly: boolean) => (
    <ProFormUploadButton
      name="trainingMaterial"
      label={<FormattedMessage id='other.materials'/>}
      title={<FormattedMessage id='please.upload.file'/>}
      max={1}
      fieldProps={{
        name: 'file',
        method: 'POST',
        onChange: (info: any) => {
          console.log(info);
        },
        beforeUpload: (file: any) => {
          console.log(file);
        },
      }}
      action="/upload.do"
      extra="Support for pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar"
    />
  ),
};


export const DevicePartsFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID"/>
  ),

  name: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[{required: true, message: 'required'}]}
      width="md"
      name="name"
      label={<FormattedMessage id='name'/>}
      tooltip="Unique"
    />
  ),

  goodNo: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="goodNo"
      label={<FormattedMessage id='good.no'/>}
    />
  ),

  format: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="format"
      label={<FormattedMessage id='specification'/>}
    />
  ),

  type: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="type"
      label={<FormattedMessage id='type'/>}
    />
  ),

  comment: (value: any, readonly: boolean) => (
    <ProFormTextArea
      initialValue={value}
      readonly={readonly}
      width="md"
      name="comment"
      label={<FormattedMessage id='comment'/>}
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

export const DeviceRepairFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID"/>
  ),

  content: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[{required: false, message: 'required'}]}
      width="md"
      name="content"
      label={<FormattedMessage id='maintenance.content'/>}
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

  repairCycle: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="repairCycle"
      label={<FormattedMessage id='maintenance.cycle'/>}
    />
  ),
  comment: (value: any, readonly: boolean) => (
    <ProFormTextArea
      initialValue={value}
      readonly={readonly}
      width="md"
      name="comment"
      label={<FormattedMessage id='comment'/>}
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



export type Device = {
  id: string;
  name: string;
  deviceModel: string;
  deviceType: string;
  mainParam: string;
  owner: string;
  trainingMaterial: string;
  trainingMaterialName: string;
  otherMaterialName: string;
  otherMaterial: string;
  remindInfo: string;
  createDate: string;
  lastModifiedDate: string;
  deviceName: string;
  platformList: any[];
};
