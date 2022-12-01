import { BaseService } from '@/services/BaseService';
import { Sample } from '@/domains/Sample.d';
import { request } from '@@/plugin-request/request';
import { Result } from '@/domains/Common';

export default class SampleService extends BaseService<Sample> {
  getDomain(): string {
    return 'sample';
  }

  beforeAdd(): any {}

  /** 存储样本预估值 */
  public async uploadExcel(params: any) {
    console.log("param", params)
    const filedata = new FormData();
    if (params.projectId) {
      filedata.append("projectId", params.projectId)
    }
    if (params.addMode) {
      filedata.append("uploadType", params.addMode)
    }
    if (params.file) {
      filedata.append("file", params.file)
    }

    return request<Result<any[]>>(`${API_URL}/${this.getDomain()}/upload/excel`, {
      method: 'POST',
      requestType:'form',
      data: filedata,
    });
  }
}
