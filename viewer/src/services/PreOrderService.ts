import {BaseService} from '@/services/BaseService';
import {PreOrder, OrderBoard} from '@/domains/PreOrder.d';
import {request} from '@@/plugin-request/request';
import {Result} from '@/domains/Common';
import {SampleProcess} from '@/domains/Sample.d';

export default class PreOrderService extends BaseService<PreOrder> {
  getDomain(): string {
    return 'preorder';
  }

  beforeAdd(): any {
  }


  /**
   * 进度列表
   */
  public async addSampleList(params: any) {
    return request<Result<any[]>>(`${API_URL}/${this.getDomain()}/preProcess/addSampleList`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /** 列表 */
  public async processlist(params: any) {
    return request<Result<SampleProcess[]>>(`${API_URL}/${this.getDomain()}/preProcess/list`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /** sampleNo模糊查询 */
  public async getBlurSampleList(params: { sampleNo: string; projectId: string; preOrderId: string }) {
    return request<Result<any[]>>(`${API_URL}/${this.getDomain()}/blurList`, {
      method: 'GET',
      params: {...params},
    });
  }


  /**
   * 导出前处理工单
   */
  public async exportProcessOrder(params: any) {
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/preProcess/export`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /** 列表 */
  public async findBoard(params: any) {
    return request<Result<OrderBoard[]>>(`${API_URL}/${this.getDomain()}/findBoard`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /** 已录入样本列表
   * @param orderId
   */
  public async findSampleList(params: any) {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/findSampleList`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }


  /**
   * 根据板号返回所有样本板的sampleId
   */
  public async findBoardSample(params: any) {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/findBoardSample`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /**
   * 根据板号返回所有样本板的sampleId
   */
  public async findBoardNoSample(params: any) {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/findBoardNoSample`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /**
   * 查询项目下所有的前处理板信息
   */
  public async getProjectBoardList(params: any) {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/getProjectBatchList`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }


  /**
   * 根据板号返回所有样本板号
   */
  public async findBoardNo(params: any) {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/findBoardNoList`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }


  /** 编辑前处理工单
   * @param orderId
   * @param params
   */
  public async editProcessOrder(params: { orderId: string; sampleId: string; status: boolean }) {
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/updateSampleValid`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /**
   * submit
   */
  public async submit(params: any) {
    const filedata = new FormData();
    if (params.owner) {
      filedata.append('owner', params.owner);
    }
    if (params.randomMethod) {
      filedata.append('randomMethod', params.randomMethod);
    }
    if (params.saveType) {
      filedata.append('saveType', params.saveType);
    }
    if (params.sampleTotal) {
      filedata.append('sampleTotal', params.sampleTotal);
    }
    if (params.sampleList) {
      filedata.append('sampleList', params.sampleList);
    }
    if (params.projectId) {
      filedata.append('projectId', params.projectId);
    }
    if (params.file) {
      filedata.append('file', params.file);
    }
    if (params.whiteExcelFile) {
      filedata.append("whiteExcelFile", params.whiteExcelFile);
    }
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/add`, {
      method: 'POST',
      requestType: 'form',
      data: filedata,
    });
  }

  /**
   * 工单拷贝
   */
  public async preOrderCopy(params: any) {
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/copy`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /**
   * uploadWhiteList
   */
  public async submitWhiteList(params: any) {
    const filedata = new FormData();
    if (params.owner) {
      filedata.append('owner', params.owner);
    }
    if (params.randomMethod) {
      filedata.append('randomMethod', params.randomMethod);
    }
    if (params.saveType) {
      filedata.append('saveType', params.saveType);
    }
    if (params.projectId) {
      filedata.append('projectId', params.projectId);
    }
    if (params.whiteExcelFile) {
      filedata.append("whiteExcelFile", params.whiteExcelFile);
    }
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/whiteOrderAdd`, {
      method: 'POST',
      requestType: 'form',
      data: filedata,
    });
  }


  /**
   * 批量删除样本
   */
  public async removeSample(params: any) {
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/removeSample`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }


  /**
   * 删除样本
   * @param param
   */
  public async deleteSample(param: { preOrderId: any; sampleNo: any }) {
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/deleteSample`, {
      method: 'GET',
      params: {
        ...param,
      },
    });
  }
}
