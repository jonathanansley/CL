module.exports = function(sequelize, DataTypes) {
    var Categories = sequelize.define("categories", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        photo: {
          type: DataTypes.STRING,
          allowNull: false,
        }
    });
return Categories;
};
