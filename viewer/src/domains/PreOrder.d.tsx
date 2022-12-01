import {
  PlateType,
  SampleBoardType,
  SampleRandomMethod,
} from '@/components/Enums/Const';
import { ProFormDateTimePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import {FormattedMessage} from "@@/exports";

export const PreOrderFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID" />
  ),
  name: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="name"
      label={<FormattedMessage id='name'/>}
      tooltip="Unique"
    />
  ),
  randomizeMethod: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          message: 'required',
        },
      ]}
      width="sm"
      name="randomizeMethod"
      label={<FormattedMessage id='random.method'/>}
      valueEnum={SampleRandomMethod}
    />
  ),
  arrangementType: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="sm"
      name="arrangementType"
      label={<FormattedMessage id='arrangement.type'/>}
      valueEnum={PlateType}
    />
  ),
  boardType: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      rules={[{ required: true, message: 'required' }]}
      width="sm"
      name="boardType"
      label={<FormattedMessage id='plate.type'/>}
      valueEnum={SampleBoardType}
    />
  ),
  sampleTotal: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          message: 'required',
        },
      ]}
      width="md"
      name="sampleTotal"
      label={<FormattedMessage id='samples.total'/>}
    />
  ),
  sampleSize: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          message: 'required',
        },
      ]}
      width="md"
      name="sampleSize"
      label={<FormattedMessage id='sample.size'/>}
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

export type OrderBoard = {
  id: string;
  orderId: string;
  boardId: string;
  orderName: string;
  boardIndex: string;
  boardSampleSize: string;
  boardType: string;
  hasInvalidSample: boolean;
  sampleBoardVOList: any[];
};

export type PreOrder = {
  id: string;
  name: string;
  randomMethod: string;
  saveType: number;
  arrangementType: string;
  boardType: string;
  sampleTotal: string;
  sampleList: string[];
  sampleSize: string;
  owner: string;
  status: number;
  createDate: string;
  lastModifiedDate: string;
  type: number;
};

export type SampleProcess = {
  id: string;
  projectId: string;
  orderId: string;
  matrix: string[];
  species: string[];
  groupName: string;
  position: string;
  volume: number;
  nineNineSampleBoardPosition: string;
  ninetySixSampleBoardPosition: string;
  epPosition: string;
  sampleStatus: string;
  description: string;
  createDate: string;
  isValid: boolean;
  lastModifiedDate: string;
};
