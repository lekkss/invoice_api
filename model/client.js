export default (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "client",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
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
    },
    {
      freezeTableName: true,
    }
  );

  return Client;
};
