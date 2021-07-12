import { problemRepository } from '../../database/problemsRepository';
import { ProblemEntity } from '../../database/entities/problemEntity';

class ProblemsService{ // implements CRUD {
    ProbsRepos = new problemRepository();

    async create(resource: ProblemEntity) {
        console.log("problemsService create func");
        return this.ProbsRepos.createProblem(resource);
    }

    async list(){
        console.log("problemsService list func");
        return this.ProbsRepos.getAllProblems();
    }

    async getProblemHoldList(id: string){ 
        console.log("problemsService problemHoldList func");
        return this.ProbsRepos.getProblemHoldList(id);
    }

    /*async deleteById(id: string) {
        return ProbsRepos.removeProblemById(id);
    }

    async patchById(id: string, resource: PatchProblemDto): Promise<any> {
        return ProbsRepos.patchProblemById(id, resource);
    }

    async putById(id: string, resource: PutProblemDto): Promise<any> {
        return ProbsRepos.putProblemById(id, resource);
    }*/

    async searchById(id: string) {
        return this.ProbsRepos.searchById(id);
    }

    async getByAuthor(authorUsername: string) {
        return this.ProbsRepos.searchByUsername(authorUsername);
    }
    async getByName(name: string) {
        return this.ProbsRepos.searchByName(name);
    }
}

export default new ProblemsService();
