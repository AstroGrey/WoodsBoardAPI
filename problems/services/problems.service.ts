import { problemRepository } from '../../database/problemsRepository';
import { ClientProblemEntity } from  '../../common/interfaces/clientProblemEntity'
import { ClientLogSendEntity } from  '../../common/interfaces/ClientLogSendEntity'
import { LogSendRepository } from '../../database/logSendRepository';
 
class ProblemsService{ 
    ProbsRepos = new problemRepository();
    LogSendRepos = new LogSendRepository();

    async create(resource: ClientProblemEntity) {
        console.log("problemsService create func");
        return this.ProbsRepos.createProblem(resource);
    }
    async list(){
        console.log("problemsService list func");
        return this.ProbsRepos.getAllProblems();
    }
    async deleteById(id: string){
        return this.ProbsRepos.removeById(id);
    }
    async deleteProblems(){
        this.ProbsRepos.deleteAllProblems();
    }
    async patchById(id: string, resource: ClientProblemEntity): Promise<ClientProblemEntity> {
        return this.ProbsRepos.patchProblemById(id, resource);
    }
    async searchById(id: string) {
        console.log("problemsService searchById func");
        let problem = await this.ProbsRepos.searchById(id);
        return await this.ProbsRepos.translateToClientEntity(problem);
    }
    async getByAuthor(authorUsername: string) {
        return this.ProbsRepos.searchByUsername(authorUsername);
    }
    async getByName(name: string) {
        return this.ProbsRepos.searchByName(name);
    }
    async logSend(sendInfo: ClientLogSendEntity){
        console.log("problemsService logSend func");
        return this.LogSendRepos.logSend(sendInfo);
    }
    async listByAngleAndGrade(angle: string, grade: string){
        return this.ProbsRepos.getProblemsByGradeAndAngle(angle, grade);
    }
    async listByAngle(angle: string){
        return this.ProbsRepos.convertClimbsAroundAngle(angle);
    }
    /*async getLog(sendInfo: ClientLogSendEntity){
        console.log("problemsService logSend func");
        return this.LogSendRepos.getLog(sendInfo);
    }*/
}

export default new ProblemsService();
