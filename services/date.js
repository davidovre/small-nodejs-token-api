/*
*  DateService is created to handle date logic
*/

const dates = {};

dates.currentDate = () =>  Date.now();
dates.futureDateTime = (timer) => Date.now + timer

module.exports = dates;