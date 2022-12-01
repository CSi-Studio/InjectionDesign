import type {Result} from "@/domains/Common";
import type {Key} from "react";
// @ts-ignore
import {request} from "umi";

export abstract class BaseService<T> {
  public abstract getDomain(): string;

  public abstract beforeAdd(): any;

  /** 列表 */
  public async list(params: any) {
    return request<Result<T[]>>(`${API_URL}/${this.getDomain()}/list`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /** 列表 */
  public async all(params: any) {
    return request<Result<T[]>>(`${API_URL}/${this.getDomain()}/all`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /** 新增 */
  public async add(params: any) {
    return request<Result<T>>(`${API_URL}/${this.getDomain()}/add`, {
      method: 'post',
      params,
    });
  }

  /** 更新 */
  public async update(params: any) {
    return request<Result<T>>(`${API_URL}/${this.getDomain()}/update`, {
      method: 'POST',
      params,
    });
  }

  /** 删除 GET  */
  public async remove(ids: Key[]) {
    return request(`${API_URL}/${this.getDomain()}/remove`, {
      method: 'GET',
      params: {
        ids
      },
    });
  }

  /** 删除 GET  */
  public async delete(id: Key) {
    return request(`${API_URL}/${this.getDomain()}/delete`, {
      method: 'GET',
      params: {
        id
      },
    });
  }

  /** 批量新增 */
  public async batchAdd(params: any) {
    return request<Result<T>>(`${API_URL}/${this.getDomain()}/batchAdd`, {
      method: 'POST',
      params: {
        ...params,
      },
    });
  }

  /** 批量更新 */
  public async batchUpdate(params: any) {
    return request<Result<T>>(`${API_URL}/${this.getDomain()}/batchUpdate`, {
      method: 'POST',
      params,
    });
  }

  /** 批量删除 GET  */
  public async batchRemove(params: { id: any }) {
    return request(`${API_URL}/${this.getDomain()}/batchRemove`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  /** 导出 GET  */
  public async export(id: Key) {
    return request(`${API_URL}/${this.getDomain()}/export`, {
      method: 'GET',
      params: {
        id,
      },
    });
  }

  /** 导入 GET  */
  public async import(params: { id: any }) {
    return request(`${API_URL}/${this.getDomain()}/import`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }
}
