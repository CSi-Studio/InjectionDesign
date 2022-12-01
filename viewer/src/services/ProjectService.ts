import type { Result } from '@/domains/Common';
import type { Project } from '@/domains/Project.d';
//@ts-ignore
import type { Trace } from '@/domains/Trace.d';
import { BaseService } from '@/services/BaseService';
import { request } from '@@/plugin-request/request';

export default class ProjectService extends BaseService<Project> {
  getDomain(): string {
    return 'project';
  }

  beforeAdd(): any {
    return;
  }

  public async getProject(id: any) {
    return request<Result<Project>>(`${API_URL}/${this.getDomain()}/get`, {
      method: 'GET',
      params: {
        id,
      },
    });
  }


  /** 获取项目详情 */
  public async detail(id: string) {
    return request<Result<Trace>>(`${API_URL}/${this.getDomain()}/detail`, {
      method: 'GET',
      params: {
        id,
      },
    });
  }
}
