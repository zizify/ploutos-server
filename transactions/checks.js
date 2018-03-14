const checkDate = (year, month, day) => {
	if ((month < 0) || (month > 12)) {
		return false;
	}

	if (day < 0) {
		return false;
	}

	if (month === 2) {
		if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
			if (day > 29) {
				return false;
			}
		} else {
			if (day > 28) {
				return false;
			}
		}
	} else if ([4, 6, 9, 11].includes(month)) {
		if (day > 30) {
			return false;
		}
	} else {
		if (day > 31) {
			return false;
		}
	}
    
	return true;
};

module.exports = {checkDate};