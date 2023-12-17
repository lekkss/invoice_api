export default (sequelize, Sequelize) => {
  const Invoice = sequelize.define(
    "invoice",
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      payment_link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.user, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    Invoice.belongsTo(models.client, {
      foreignKey: "client_id",
    });
  };

  return Invoice;
};
