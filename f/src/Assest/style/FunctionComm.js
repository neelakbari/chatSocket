import CheckableTag from "antd/es/tag/CheckableTag";

export const stringToHslColor = (str, s = 30, l = 80) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let h = hash % 360;
  return "hsl(" + h + ", " + s + "%, " + l + "%)";
};

export const generateAvatar = (text) => {
 
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Draw background
  context.fillStyle = stringToHslColor(text);
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = "bold 65px montserrat_regular";
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";

  let first = text?.split(" ")[0]?.charAt(0)?.toUpperCase();
  let last = text?.split(" ")[1]?.charAt(0)?.toUpperCase();

  if (!last) {
    last =
      text?.split(" ")[0]?.charAt(1)?.toUpperCase() ||
      text?.split(" ")[0]?.charAt(0)?.toUpperCase();
  }
  if (!first) {
    first = "S";
    last = "U";
  }

  context.fillText(first + last, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL("image/png");
};
