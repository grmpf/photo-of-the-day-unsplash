function timeNow(showSeconds = false) {
	const d = new Date()
	const hTmp = d.getHours()
	const mTmp = d.getMinutes()
	const h = (hTmp < 10 ? '0' : '') + hTmp
	const m = (mTmp < 10 ? '0' : '') + mTmp
	if(showSeconds) {
		const sTmp = d.getSeconds()
		const s = (sTmp < 10 ? '0' : '') + sTmp
		return h + ':' + m + ':' + s
	} else {
		// seconds could be used to calc the offset and sync updates with the real time
		return h + ':' + m
	}
}

function timeNow2(showSeconds = false, hour12 = false, locale = undefined) {
	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: hour12,
	}
	if (showSeconds) {
		options['second'] = '2-digit'
	}
	return new Date().toLocaleTimeString(locale, options) // undefined locale is perfectly fine
}

function dateFromNow(addOrSub = 0) {
	const nowDate = new Date();
	if(addOrSub !== 0) {
		nowDate.setDate(nowDate.getDate() + addOrSub);
	}
	const dTmp = nowDate.getDate() // between 1 and 31
	const mTmp = nowDate.getMonth()+1 // between 0 and 11
	const yTmp = nowDate.getFullYear()
	const d = (dTmp < 10 ? '0' : '') + dTmp
	const m = (mTmp < 10 ? '0' : '') + mTmp
	const y = (yTmp < 10 ? '0' : '') + yTmp

	return d + '.' + m + '.' + y
}

const options0: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
}
function dateFromNow2(addOrSub = 0, options: Intl.DateTimeFormatOptions = options0, locale?: string) {
	const nowDate = new Date();
	if(addOrSub !== 0) {
		nowDate.setDate(nowDate.getDate() + addOrSub);
	}
	return nowDate.toLocaleDateString(locale, options) // undefined locale is perfectly fine
}

export {
	timeNow, timeNow2,
	dateFromNow, dateFromNow2
}
