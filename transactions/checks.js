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

const checkTransaction = (type, amount, recipient, source) => {
	if (!['income', 'expense', 'savings'].includes(type)) {
		return 'Invalid type.';
	} else if ((type === 'expense') || (type === 'savings')) {
		if (amount > 0) {
			return 'Amount should be zero or negative.';
		} else if ((!recipient) || (source)) {
			return `The ${type} type of transaction should have a recipient and no source.`;
		}
	} else if (type === 'income') {
		if (amount < 0) {
			return 'Amount should be zero or positive.';
		} else if ((recipient) || (!source)) {
			return `The ${type} type of transaction should have a source and no recipient.`;
		}
	}
    
	return false;
};

module.exports = {checkDate, checkTransaction};