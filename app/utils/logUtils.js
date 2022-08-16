function getTodaysLogfile() {
    const dateToday = new Date().toLocaleDateString().replace(/\//g, '-');
    return `${dateToday}.log`;
}

exports.getTodaysLogfile = getTodaysLogfile;