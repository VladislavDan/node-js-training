import sequelize, { Sequelize } from 'sequelize';
const { DataTypes } = sequelize;

export const DataBase = () => new Sequelize('users', 'postgres', 'postgres', {
    host: "localhost",
    dialect: 'postgres',
    port: 5432
});

export const Group = DataBase().define('group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    timestamps: false
});

export const User = DataBase().define('user', {
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isdeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
});

export const UserGroup = DataBase().define('user_group', {
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

User.belongsToMany(Group, {
    through: UserGroup,
    sourceKey: 'id',
    foreignKey: 'userid',
    onDelete: 'cascade',
    onUpdate: 'cascade'
});
Group.belongsToMany(User, {
    through: UserGroup,
    sourceKey: 'id',
    foreignKey: 'groupid',
    onDelete: 'cascade',
    onUpdate: 'cascade'
});
