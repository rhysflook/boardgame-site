export interface Styles {
  [key: string]: string;
}
export const convertStyles = (styles: Styles): string => {
  let styleString = '{';
  Object.entries(styles).forEach((style: [string, string]) => {
    styleString += `${style[0].replace(
      /[A-Z][a-z]*/g,
      (str) => '-' + str.toLowerCase()
    )}: ${style[1]};`;
  });
  styleString += '}';
  return styleString;
};
