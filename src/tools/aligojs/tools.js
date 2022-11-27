function snakeToCamel(str) {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function snakeToCamelReviver(k, v) {
    if (v instanceof Object) {
        for (const key of Object.keys(v)) {
            if (key.indexOf('_') !== -1) {
                let temp = v[key];
                delete v[key];
                v[snakeToCamel(key)] = temp;
            }
        }
    }
    return v;
}

function snakeToCamelObject(obj) {
    if (!(obj instanceof Object)) return obj;
    for (const key of Object.keys(obj)) {
        let temp = obj[key];
        if (key.indexOf('_') !== -1) {
            delete obj[key];
            obj[snakeToCamel(key)] = temp;
        }
        if (temp instanceof Object) {
            snakeToCamelObject(temp);
        }
    }
    return obj;
}

export { snakeToCamel, snakeToCamelReviver, snakeToCamelObject };