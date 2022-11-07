import { Report } from 'src/reports/report.entity';
import { User } from 'src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Report],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
