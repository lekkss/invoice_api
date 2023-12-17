export default (sequelize, Sequelize) => {
  const Client = sequelize.define(
    "client",
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  Client.associate = (models) => {
    Client.belongsTo(models.user, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    Client.hasMany(models.invoice, {
      foreignKey: "client_id",
    });
  };

  return Client;
};
