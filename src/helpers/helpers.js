export const appendScript = (scriptToAppend) => {
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = true;
    document.body.appendChild(script);
}

export const formatNumber = (number, size) => {
    return parseInt(number).toLocaleString("tr-TR", {
        minimumIntegerDigits: size,
        useGrouping: false
    });
}

export const formatDecimal = (number, size = 2) => {
    return parseFloat(number).toFixed(size).replace(".", ",").replace(/\d(?=(\d{3})+,)/g, '$&.');
}

export const formatDate = (date, type = null) => {
    date = new Date(date);    
	var dateString = "";

	var monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
	
    var day = formatNumber(date.getDate(), 2);
    var monthIndex = date.getMonth();
    var month = formatNumber(monthIndex + 1, 2);
    var year = date.getFullYear();

    var hour = formatNumber(date.getHours(), 2);
    var minute = formatNumber(date.getMinutes(), 2);
    var second = formatNumber(date.getSeconds(), 2);

    switch (type) {
        case "full":
            dateString = day + " " + month + " " + year + " " + hour + ":" + minute + ":" + second;
            break;
        case "halfStr":
            dateString = day + " " + monthNames[monthIndex] + " " + year + " " + hour + ":" + minute;
            break;
        case "small":
            dateString = day + "." + month + "." + year;
            break;
        case "inputSmall":
            dateString = year + "-" + month + "-" + day;
            break;
        case "nochar":
            dateString = day + month + year + hour + minute + second;
            break;
        default:
            dateString = year + "-" + month + "-" + day + "T" + hour + ":" + minute;
            break;
    }

	return dateString;
}

export const sumLineChildrenPrices = (children) => {
    var totalPrice = 0;

    children.forEach(x => {
        totalPrice += x.children && x.children.length > 0 ? (x.type === 0 ? (x.unitPrice * x.qty) ?? 0 : sumLineChildrenPrices(x.children)) : (x.unitPrice * x.qty) ?? 0
    });

    return totalPrice;
}