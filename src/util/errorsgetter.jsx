const errorsgetter = (errors) => {
  let errorText = ``;

  errors.forEach((ele) => (errorText += `${ele.path}: ${ele.msg}\n`));

  return errorText;
};

export default errorsgetter;
