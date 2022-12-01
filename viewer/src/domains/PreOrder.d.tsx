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
