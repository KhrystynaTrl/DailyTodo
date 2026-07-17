export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const isValidEmail = (value: string): boolean => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

  return emailRegex.test(value.trim().toLowerCase());
};

export const minLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};
