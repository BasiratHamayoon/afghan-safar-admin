const getDataBlob = async (image) => {
  const res = () =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        const mimeType = result.split(",")[0].split(":")[1].split(";")[0];
        const base64Data = result.split(",")[1];
        resolve({ base64Data, mimeType });
      };
      reader.readAsDataURL(image);
    });

  const { base64Data, mimeType } = await res();

  return `data:${mimeType};base64,${base64Data}`;
};

export default getDataBlob;
