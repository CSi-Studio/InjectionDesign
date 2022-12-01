import {
  ProFormDigit,
  ProFormText,
  ProFormSelect
} from '@ant-design/pro-form';
import {MsType, Polarity, RunType} from "@/components/Enums/Const";

export const RunFields: any = {
  id: (value: any, readonly: boolean) => <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label='ID'/>,
  name: (value: any, readonly: boolean) => <ProFormText initialValue={value} readonly={readonly} width="md" name="name" label='进样名' />,
  projectName: (value: any, readonly: boolean) => <ProFormText initialValue={value} readonly={readonly} width="md" name="name" label='项目'/>,
  platform: (value: any, readonly: boolean) => <ProFormText initialValue={value} readonly={readonly} width="sm" name="platform" label='平台'/>,
  setName: (value: any, readonly: boolean) => <ProFormText initialValue={value} readonly={readonly} width="sm" name="setName" label='板号'/>,
  group: (value: any, readonly: boolean) => <ProFormText initialValue={value} readonly={readonly} width="sm" name="group" label='分组'/>,
  runType: (value: any, readonly: boolean) => <ProFormSelect initialValue={value} readonly={readonly} width="sm" name="runType" label='进样类型' valueEnum={RunType}/>,
  polarity: (value: any, readonly: boolean) => <ProFormSelect initialValue={value} readonly={readonly} width="sm" name="polarity" label='极性' valueEnum={Polarity}/>,
  msType: (value: any, readonly: boolean) => <ProFormSelect initialValue={value} readonly={readonly} width="sm" name="msType" label='光谱型' valueEnum={MsType}/>,
  column: (value: any, readonly: boolean) => <ProFormDigit initialValue={value} readonly={readonly} width="sm" name="column" label='柱号'/>,
  ordinal: (value: any, readonly: boolean) => <ProFormDigit initialValue={value} readonly={readonly} width="sm" name="ordinal" label='进样号'/>,
}

export type Run = {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  platform: string;
  setName: string;
  group: string;
  column: number;
  ordinal: number;
  totalCount: number;
  rtUnit: string;
  msType: string;
  polarity: string;
  airdType: string;
  runType: string;
  injectVol: number;
  airdSize: number;
  airdIndexSize: number;
  vendorFileSize: number;
  createDate: string;
}
