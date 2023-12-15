export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "invoice",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "client",
          key: "uuid",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return Invoice;
};
