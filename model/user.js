export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company_reg_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      defaultScope: {
        // exclude password by default
        attributes: { exclude: ["password"] },
      },
      scopes: {
        // include password with this scope
        withPassword: { attributes: {} },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.invoice, {
      foreignKey: "user_id",
    });
    User.hasMany(models.client, {
      foreignKey: "user_id",
    });
  };

  return User;
};
