import {
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import ProjectService from '@/services/ProjectService';
// @ts-ignore
import { FormattedMessage } from 'umi';
const projectService = new ProjectService();

export const SampleFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID"/>
  ),
  sampleNo: (value: any, readonly: boolean) => (
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
      name="sampleNo"
      label={<FormattedMessage id='sample.no'/>}
      placeholder="Demo: serum"
      tooltip="Unique"
    />
  ),

  projectId: (value: any, readonly: boolean) => (
    <ProFormSelect
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
      name="projectId"
      label={<FormattedMessage id='project'/>}
      placeholder="Project Id"
      request={async () => {
        const res: any[] = [];
        const projectListData = await projectService.list({});
        projectListData?.data.map((item: { name: any; id: any }) => {
          const temp: Record<any, any> = {};
          temp.label = item.name;
          temp.value = item.name;
          res.push(temp);
          return null;
        });
        return res;
      }}
      tooltip="Unique"
    />
  ),

  dim1: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="dim1"
      label='Dim1'
    />
  ),
  dim2: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="dim2"
      label='Dim2'
    />
  ),
  dim3: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="dim3"
      label='Dim3'
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

export type Sample = {
  id: string;
  sampleNo: string;
  type: string;
  projectNo: string;
  dim1: string;
  dim2: string;
  dim3: string;
  index: number;
  set: number;
  position: string;
  createDate: string;
  lastModifiedDate: string;
};

export type SampleProcess = {
  id: string;
  sampleId: string;
  projectId: string;
  orderId: string;
  matrix: string[];
  species: string[];
  groupName: string;
  position: string;
  volume: number;
  nineNineBoardPosition: string;
  ninetySizeBoardPosition: string;
  epBoardPosition: string;
  sampleStatus: string;
  description: string;
  createDate: string;
  lastModifiedDate: string;
};

export type SampleStat = {
  name: string;
  count: number;
}

export type DesignParams = {
  plateType: number;
  maxSamplesOnSinglePlate: number;
  pooledQcCount: number;
  ltrQcCount: number;
  solventBlankQcCount: number;
  processBlankQcCount: number;
  commonQcCount: number;
  direction: number;
  interBatchRandomMethod: number;
  interBatchRandomDim: number;
  intraBatchRandomMethod: number;
  intraBatchRandomDim: number;
}

export type SampleSequence = {
  well: string;
  Type: string;
  SampleId: string;
  Dilution: number;
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
};
