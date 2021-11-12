import { Sequelize } from 'sequelize';

export const DataBase = () => new Sequelize('users', 'postgres', 'postgres', {
    host: "localhost",
    dialect: 'postgres',
    port: 5432
});
