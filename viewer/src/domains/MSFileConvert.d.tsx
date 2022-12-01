export type MsFileConvert = {
  id: string;
  msOrderId: string;
  msOrderName: string;
  status: number;
  boardNo: String;
  createDate: string;
  lastModifiedDate: string;
}

export type MsBatchConvert = {
  batchId: string;
  msOrderId: string;
  batchName: string;
  status: number;
  convertStatus: string;
}

export type MsBatchSampleConvert = {
  id: string;
  sampleNo: string;
  fileName: string;
  status: string;
}
