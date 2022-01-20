import dotenv from 'dotenv';
dotenv.config({ debug: true });
import sequelize, {Sequelize} from 'sequelize';

const {DataTypes} = sequelize;

const nonTypedProcess: any = process;

export const DataBase = () => new Sequelize(
    nonTypedProcess.env.DATA_BASE,
    nonTypedProcess.env.USER_NAME,
    nonTypedProcess.env.PASSWORD,
    {
        host: nonTypedProcess.env.HOST,
        dialect: 'postgres',
        port: nonTypedProcess.env.PORT
    }
);

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
