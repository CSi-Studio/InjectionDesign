import {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDateTimePicker,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { PlatformStatus, SupportPlatForm } from '@/components/Enums/Const';
// @ts-ignore
import { Link } from 'umi';
import DeviceService from '@/services/Device';
import { PlusOutlined } from '@ant-design/icons';
import {FormattedMessage} from "@@/exports";

const service = new DeviceService();

export const PlatformFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID" />
  ),
  name: (value?: any, readonly?: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="md"
      name="name"
      label={<FormattedMessage id='name'/>}
      tooltip="Unique"
      placeholder="Demo：pos"
      valueEnum={SupportPlatForm}
    />
  ),
  device: (value?: any, readonly?: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="md"
      name="device"
      label={<FormattedMessage id='instrument'/>}
      request={async () => {
        const res: any[] = [];
        const beforeAddPlatform = await service.list({});
        beforeAddPlatform?.data.map((item: { name: any; id: any }) => {
          const temp: Record<any, any> = {};
          temp.label = item.name;
          temp.value = item.name;
          res.push(temp);
          return null;
        });
        return res;
      }}
      fieldProps={{
        dropdownRender: (e) => {
          return (
            <>
              <Link
                to={{
                  pathname: '/device',
                }}
                style={{
                  paddingLeft: '10px',
                }}
              >
                <PlusOutlined /> {<FormattedMessage id='create.instrument'/>}
              </Link>
              {e}
            </>
          );
        },
      }}
    />
  ),
  mathPath: (value?: any, readonly?: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="md"
      name="mathPath"
      label={<FormattedMessage id='method.file'/>}
      placeholder="Demo: D:/data"
    />
  ),
  msFilePath: (value?: any, readonly?: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="md"
      name="msFilePath"
      label={<FormattedMessage id='ms.output.file'/>}
      placeholder="Demo: D:/data"
    />
  ),
  checkPlatform: (value?: any, readonly?: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="md"
      name="checkPlatform"
      label={<FormattedMessage id='analytical.platform'/>}
    />
  ),
  deviceStatus: (value?: any, readonly?: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="md"
      name="status"
      label={<FormattedMessage id='status'/>}
      valueEnum={PlatformStatus}
    />
  ),
  owner: (value?: any, readonly?: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="md"
      name="owner"
      label={<FormattedMessage id='owner'/>}
      placeholder="Demo: Tank"
    />
  ),
  description: (value?: any, readonly?: boolean) => (
    <ProFormTextArea
      initialValue={value}
      readonly={readonly}
      rules={[{ pattern: /^.{1,200}$/, message: '<200 characters' }]}
      width="xl"
      name="description"
      label={<FormattedMessage id='description'/>}
      tooltip="<200 characters"
    />
  ),
  createDate: (value?: any, readonly?: boolean) => (
    <ProFormDateTimePicker
      initialValue={value}
      readonly={readonly}
      width="sm"
      name="createDate"
      label={<FormattedMessage id='create.date'/>}
    />
  ),
  lastModifiedDate: (value?: any, readonly?: boolean) => (
    <ProFormDateTimePicker
      initialValue={value}
      readonly={readonly}
      width="sm"
      name="lastModifiedDate"
      label={<FormattedMessage id='update.date'/>}
    />
  ),
  sopFile: (value?: any, readonly?: boolean) => (
    <ProFormUploadButton
      name="sopFile"
      label={<FormattedMessage id='SOP.file'/>}
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
      extra="support for pdf, doc, docx, xls, xlsx, ppt, pptx, zip, rar"
    />
  ),
};

export type Platform = {
  id: string;
  name: string;
  device: string;
  mathPath: string;
  msFilePath: string;
  deviceStatus: string;
  owner: string;
  fileName: string;
  fileId: string;
  createDate: string;
  lastModifiedDate: string;
  checkPlatform: string;
  status: string;
  sopFile: string;
};

export type PlatformConfig = {
  platform: string;
  methodId: string;
  methodName: string;
  insLibId: string;
  insLibName: string;
  anaLibId: string;
  anaLibName: string;
};
