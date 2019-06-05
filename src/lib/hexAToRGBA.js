const hexAToRGBA = (h) => {
    let r = 0, g = 0, b = 0, a = 1;

    if (h.length == 5) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
      a = "0x" + h[4] + h[4];
  
    } else if (h.length == 9) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
      a = "0x" + h[7] + h[8];
    }
    a = +(a / 255).toFixed(2);
  
    return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
}

export default hexAToRGBA;