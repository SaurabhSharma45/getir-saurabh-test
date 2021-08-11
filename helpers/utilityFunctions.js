function stringToNumber(str, defaultNum) {
    let num = parseInt(str, 10);
    num = isNaN(num) ? defaultNum : num;
    return num;
}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }


const utility = {
    stringToNumber,
    sleep
}

module.exports = utility;

