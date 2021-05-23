const uploadFile = require("../middleware/upload");
const fs = require('fs');

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Por favor, selecciona un fichero!" });
    }

    res.status(200).send({
      message: "Imagen subida correctamente: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 2MB!",
        });
      }
    res.status(500).send({
      message: `No se ha podido subir el fichero: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/src/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: directoryPath + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/src/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "No se ha podido descargar el fichero. " + err,
      });
    }
  });
};

const delFile = (req, res) => {
    const fileName = req.params.name;

    if(!fileName) {
        res.status(500).send({
            message: "No se ha recibido ningún fichero!",
        });
    }
    const directoryPath = __basedir + "/src/assets/uploads/";
  
    try {
        fs.unlinkSync(directoryPath+fileName);
        //file removed
        res.status(200).send({
            message: "El fichero se ha eliminado correctamente!",
        });
    } catch(err) {
        console.error(err);
        res.status(400).send({
            message: "No se ha podido eliminar el fichero!",
        });
    }
};

module.exports = {
  upload,
  getListFiles,
  download,
  delFile
};