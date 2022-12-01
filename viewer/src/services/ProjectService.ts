import type { Project } from '@/domains/Project.d';
import { BaseService } from '@/services/BaseService';

export default class ProjectService extends BaseService<Project> {
  getDomain(): string {
    return 'project';
  }

  beforeAdd(): any {
    return;
  }
}
