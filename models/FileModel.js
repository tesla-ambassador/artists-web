const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class File extends Model {}

  File.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.ENUM('ZIP', 'MP3', 'WAV'),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encryptedData: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    nftTokenId: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'File',
  });
  
  return File;
};
