import {
  ProFormText,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { FormattedMessage } from 'umi';
/**
 * 服务
 */
export const ProjectFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID"/>
  ),
  name: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          message: <FormattedMessage id='project.no.format.tip.error'/>,
        },
      ]}
      width="md"
      name="name"
      label={<FormattedMessage id='project.no'/>}
      placeholder="Demo: P001_220301"
    />
  ),
  alias: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="alias"
      label={<FormattedMessage id='alias'/>}
      tooltip="Unique"
      placeholder="Please input project alias, Demo: has"
    />
  ),
  owner: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="owner"
      label={<FormattedMessage id='owner'/>}
      placeholder="Demo: James"
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

export type Project = {
  id: string;
  name: string;
  alias: string;
  owner: string;
  createDate: string;
  lastModifiedDate: string;
};
