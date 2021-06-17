module.exports.getQualificationKeysArr = () => {
	return qualificationKeys.reduce((acc, key) => {
		acc.push(key.subjectKey)
		acc.push(key.institutionKey)
		return acc;
	}, [])
}

module.exports.getFormMonths = () => {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	return months.map((month, index) => {
		return {
			value: index + 1,
			name: month
		}
	})
}

module.exports.getFormDays = () => {
	return new Array(31).fill(0).map((e, i) => i + 1);
}

module.exports.getFormYears = () => {
	const arr = []
	const currentYear = new Date().getFullYear();
	for (let i = currentYear; i >= currentYear - 80; i--) {
		arr.push(i)
	}
	return arr;
}

module.exports.capitalize = (str) => {
	if (!str || typeof (str) !== 'string') {
		return str;
	}
	else {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
}