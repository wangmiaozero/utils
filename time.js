const dateFormatter = (formatter, date) => {
	date = (date ? new Date(date) : new Date)
	const Y = date.getFullYear() + '',
          M = date.getMonth() + 1,
          D = date.getDate(),
          H = date.getHours(),
          m = date.getMinutes(),
          s = date.getSeconds()
    return formatter.replace(/YYYY|yyyy/g, Y)
        			.replace(/YY|yy/g, Y.substr(2, 2))
        			.replace(/MM/g, (M < 10 ? '0' : '') + M)
        			.replace(/DD/g, (D < 10 ? '0' : '') + D)
        			.replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
        			.replace(/mm/g, (m < 10 ? '0' : '') + m)
        			.replace(/ss/g, (s < 10 ? '0' : '') + s)
}

dateFormatter('YYYY-MM-DD HH:mm', '1995/02/15 13:55') // 1995-02-15 13:55