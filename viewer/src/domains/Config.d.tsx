import { ProFormDateTimePicker, ProFormText } from '@ant-design/pro-form';
//@ts-ignore
import {FormattedMessage} from "umi";

export const SpeciesFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID" />
  ),
  speciesNo: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="configNo"
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: <FormattedMessage id='input.correct.species.no'/>,
        },
      ]}
      placeholder="Please input species no. Demo: 001"
      label={<FormattedMessage id='species.no'/>}
    />
  ),
  speciesName: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="configName"
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: <FormattedMessage id='input.correct.species.name'/>,
        },
      ]}
      placeholder="Please input species name, Demo: has"
      label={<FormattedMessage id='species.name'/>}
    />
  ),
  speciesAlias: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="alias"
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: <FormattedMessage id='input.correct.species.alias'/>,
        },
      ]}
      placeholder="Please input species alias, Demo: has"
      label={<FormattedMessage id='species.alias'/>}
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

export const MatrixFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="基质id" />
  ),
  matrixNo: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="configNo"
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: <FormattedMessage id='input.correct.matrix.no'/>,
        },
      ]}
      placeholder="Please input matrix alias, Demo: 001"
      label={<FormattedMessage id='matrix.no'/>}
    />
  ),
  matrixName: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="configName"
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: <FormattedMessage id='input.correct.matrix.name'/>,
        },
      ]}
      placeholder="Please input matrix name, Demo: serum"
      label={<FormattedMessage id='matrix.name'/>}
    />
  ),
  matrixAlias: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="alias"
      rules={[
        {
          required: true,
          pattern: /^.{1,50}$/,
          message: <FormattedMessage id='input.correct.matrix.alias'/>,
        },
      ]}
      placeholder="Please input matrix alias"
      label={<FormattedMessage id='matrix.alias'/>}
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

export type Config = {
  id: string;
  configNo: string;
  configName: string;
  alias: string;
  createDate: string;
  lastModifiedDate: string;
};
