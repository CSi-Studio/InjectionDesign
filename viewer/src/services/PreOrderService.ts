import {BaseService} from '@/services/BaseService';
import {PreOrder} from '@/domains/PreOrder.d';
import {request} from '@@/plugin-request/request';
import {Result} from '@/domains/Common';

export default class PreOrderService extends BaseService<PreOrder> {
  getDomain(): string {
    return 'preorder';
  }

  beforeAdd(): any {
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
}
