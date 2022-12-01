import {BaseService} from "@/services/BaseService";
//@ts-ignore
import {Library} from "@/domains/Library.d";
import {request} from "@@/plugin-request/request";
import {Result} from "@/domains/Common";

export default class LibraryService extends BaseService<Library>{
  getDomain(): string {
    return "library";
  }

  beforeAdd(): any {
  }

  public async upload(params: any) {
    const filedata = new FormData();
    if (params.libFile) {
      filedata.append('libFile', params.libFile[0].originFileObj);
    }
    if (params.name){
      filedata.append('name', params.name);
    }
    if (params.type){
      filedata.append('type', params.type);
    }
    if (params.description){
      filedata.append('description', params.description);
    }
    if (params.matrix){
      filedata.append('matrix', params.matrix);
    }
    if (params.species){
      filedata.append('species', params.species);
    }
    if (params.tags){
      filedata.append('tags', params.tags);
    }

    return request<Result<Library>>(`${API_URL}/${this.getDomain()}/upload`, {
      method: 'POST',
      requestType:'form',
      body: filedata,
    });
  }

}
