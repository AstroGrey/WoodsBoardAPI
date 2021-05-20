import ProblemsDao from '../daos/problems.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateProblemDto } from '../dto/create.problem.dto';
import { PutProblemDto } from '../dto/put.problems.dto';
import { PatchProblemDto } from '../dto/patch.problem.dto';

class ProblemsService implements CRUD {
    async create(resource: CreateProblemDto) {
        return ProblemsDao.addProblem(resource);
    }

    async deleteById(id: string) {
        return ProblemsDao.removeProblemById(id);
    }

    async list(limit: number, page: number) {
        return ProblemsDao.getProblems();
    }

    async patchById(id: string, resource: PatchProblemDto): Promise<any> {
        return ProblemsDao.patchProblemById(id, resource);
    }

    async putById(id: string, resource: PutProblemDto): Promise<any> {
        return ProblemsDao.putProblemById(id, resource);
    }

    async readById(id: string) {
        return ProblemsDao.getProblemById(id);
    }

    async getByAuthor(authorUsername: string) {
        return ProblemsDao.getProblemByAuthor(authorUsername);
    }
    async getByName(name: string) {
        return ProblemsDao.getProblemByName(name);
    }
}

export default new ProblemsService();
