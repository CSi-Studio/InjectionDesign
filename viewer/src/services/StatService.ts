import type { Result } from '@/domains/Common';
import type { Stat } from '@/domains/Stat.d';
import { Trace } from '@/domains/Trace.d';
import { request } from '@@/plugin-request/request';

export default class SpectrumService {
  getDomain(): string {
    return 'stat';
  }

  beforeAdd(): any {}

  public async doStatGlobalDaily(date: string) {
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/doStatGlobalDaily`, {
      method: 'GET',
      params: {
        date,
      },
    });
  }

  public async getGlobalDailyStat(date: string) {
    return request<Result<Stat>>(`${API_URL}/${this.getDomain()}/getGlobalDailyStat`, {
      method: 'GET',
      params: {
        date,
      },
    });
  }

  public async systemInfo() {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/systemInfo`, {
      method: 'GET',
      params: {},
    });
  }

  public async getRunningTraceList() {
    return request<Result<Trace[]>>(`${API_URL}/${this.getDomain()}/getRunningTraceList`, {
      method: 'GET',
      params: {},
    });
  }
}
