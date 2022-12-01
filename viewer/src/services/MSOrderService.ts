import { BaseService } from '@/services/BaseService';
import type { MSOrder } from '@/domains/MSOrder.d';
//@ts-ignore
import { request } from 'umi';
import type { Result } from '@/domains/Common';
import type {MsOrderSample} from "@/domains/MSOrder.d";
import {MsBatchConvert, MsBatchSampleConvert, MsFileConvert} from "@/domains/MSFileConvert.d";

export default class MSOrderService extends BaseService<MSOrder> {
  getDomain(): string {
    return 'msOrder';
  }
  /** 列表 */
  public async submitMsOrder(params: any) {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    });
  }

  beforeAdd(): any {}

  /** 列表 */
  public async orderList(params: any) {
    return request<Result<MsOrderSample[]>>(`${API_URL}/${this.getDomain()}/orderList`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /**
   * 文件转换列表
   */
  public async fileList(params: any) {
    return request<Result<MsFileConvert[]>>(`${API_URL}/${this.getDomain()}/msFileList`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /**
   * 批次查询
   */
  public async batchList(params:any) {
    return request<Result<MsBatchConvert[]>>(`${API_URL}/${this.getDomain()}/getMsOrderBatch`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /**
   * 批次样本查询
   */
  public async batchSampleList(params: any) {
    return request<Result<MsBatchSampleConvert[]>>(`${API_URL}/${this.getDomain()}/getMsOrderBatchSample`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

}
