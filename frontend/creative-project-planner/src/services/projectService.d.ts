// src/services/projectService.d.ts
declare module '@/services/projectService' {
    export interface ProjectService {
      createProject(projectData: any): Promise<any>;
      getProjects(): Promise<any[]>;
      updateProject(projectId: string, projectData: any): Promise<any>;
      deleteProject(projectId: string): Promise<void>;
    }
  
    export const projectService: ProjectService;
  
    export default projectService;
  }
