import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Project } from '../../src/projects/project.entity';
import { ProjectService } from '../../src/projects/project.service';
import { AppDataSource } from '../../src/datasource';

describe('ProjectService', () => {
  let dataSource: DataSource;
  let service: ProjectService;

  beforeAll(async () => {
    dataSource = AppDataSource;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    await dataSource.synchronize(true);
    service = new ProjectService(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('creates, updates status, finds by team, and deletes projects', async () => {
    const created = await service.create({
      name: 'Launch portal',
      description: 'Internal launch portal',
      teamId: 'team-alpha',
      status: 'planning',
    });

    expect(created.id).toBeDefined();
    expect(created.status).toBe('planning');

    const updated = await service.updateStatus(created.id, 'active');
    expect(updated.status).toBe('active');

    const byTeam = await service.getByTeam('team-alpha');
    expect(byTeam).toHaveLength(1);
    expect(byTeam[0]?.name).toBe('Launch portal');

    const deleted = await service.delete(created.id);
    expect(deleted).toBe(true);

    const afterDelete = await service.getByTeam('team-alpha');
    expect(afterDelete).toHaveLength(0);
  });
});
