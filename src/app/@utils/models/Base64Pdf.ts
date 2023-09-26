import { FileInput } from "ngx-material-file-input";

export function Base64toBlob(base64Data: string, contentType: string): Blob {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters: any; // = window.atob(base64Data.replace(/^data:application\/(pdf);base64,/, ''));//atob(base64Data.replace(/['"]+/g, ''));
  try {
    byteCharacters = window.atob(base64Data.replace(/^data:application\/(pdf);base64,/, ''));//atob(base64Data.replace(/['"]+/g, ''));
  } catch (error) {
    byteCharacters = window.atob(base64Data.replace(/^data:image\/(png);base64,/, ''));//atob(base64Data.replace(/['"]+/g, ''));
  }
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


export function Base64toFileInput(base64Data: string, contentType: string): FileInput {
  contentType = contentType || '';
  var sliceSize = 2024;
  var byteCharacters:any;
  try {
    byteCharacters = window.atob(base64Data.replace(/^data:application\/(pdf);base64,/, ''));//atob(base64Data.replace(/['"]+/g, ''));
  } catch (error) {
    byteCharacters = window.atob(base64Data.replace(/^data:image\/(png);base64,/, ''));//atob(base64Data.replace(/['"]+/g, ''));
  }

  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new FileInput(byteArrays);
}

/**
 *
 * @param base64 archivo en base 64
 * @param name nombre del archivo
 * @param mediaType tipo del archivo
 */
export function DownloadFile(base64: string, name: string, mediaType: string) {
  let blob = Base64toBlob(base64, mediaType);
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = name;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export function toFile(base64: string, name: string, mediaType: string) {
  console.log(base64.replace(/^data:image\/(png);base64,/, ''));
  let fileInput = Base64toFileInput(base64, mediaType);
  let blob = Base64toBlob(base64, mediaType);
  return fileInputToFile(fileInput,name, blob);
}

function blobToFile(blob: any, fileName: string){
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  return blob;
}

function fileInputToFile(fileInput: any, fileName: string, blob: any){
  fileInput.lastModifiedDate = new Date();
  fileInput.name = fileName;
  fileInput._fileNames = fileName;
  fileInput._files = [blobToFile(blob, fileName)];
  return fileInput;
}

export function validarArchivoCaracteresEspeciales(archivoAdjunto: string): boolean {
  let caracteresEspeciales = /[!@#$%^&*®☺☻♥♠♣♦◘○¿?+\=\[\]{};':"\\|,<>\/?]+/;
  if(caracteresEspeciales.test(archivoAdjunto)){
      return true;
    }else{
      return false;
    }
}
