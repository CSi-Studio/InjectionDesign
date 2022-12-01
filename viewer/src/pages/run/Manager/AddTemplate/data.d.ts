export interface StepDataType {
  payAccount: string;
  receiverAccount: string;
  receiverName: string;
  amount: string;
  receiverMode: string;
}

export type CurrentTypes = 'base' | 'confirm' | 'result';


export type PreInjectionDetailType = {
  injectionType: string;
  priority: number;
  key: string;
  sampleList: string[];
}
