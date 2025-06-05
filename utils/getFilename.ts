export const getFileLabelFromString = (str: string): string => {
  const fileNameSize = 18;
  if (str.length > fileNameSize) {
    const splittedFileName = str.split('.');
    const extension = splittedFileName[splittedFileName.length - 1];
    str = `${str.substring(0, fileNameSize)}...${extension}`;
  }
  return str;
};

const getFilenameAsLabel = (files: FileList | null) => {
  const fileNames = [];
  if (files) {
    for (let i = 0; i < files.length; i += 1) {
      let singleFileName = files[i].name;
      singleFileName = getFileLabelFromString(singleFileName);
      fileNames.push(singleFileName);
    }
  }
  const newLabel = fileNames.join(',');
  return newLabel;
};

export default getFilenameAsLabel;
