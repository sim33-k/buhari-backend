// even though in the question we are given only 3 types of dishes
// later if we want to add more types (drinks, other...)
// or even add more menu items other than the ones mentioned in the question
// we can easily have the common crud methods in the base service
// and extend them in the service that we want, instead of create
// the crud methods again in the individual serivces

export abstract class BaseService<TDto, TEntity> {
    protected repository: any;

    constructor(repository: any) {
        this.repository = repository;
    }

    public async create(dto: TDto): Promise<TEntity> {
        return this.repository.create(dto);
    }

    public async getAll(): Promise<TEntity[]> {
        return this.repository.getAll();
    }

    public async delete(id: number): Promise<void> {
        return this.repository.delete(id);
    }

}