const getParams = (urlpath) => {
    const pathname = urlpath;
    const segments = pathname.split('/');
    const themeIndex = segments.indexOf('theme');
    const themeSegments = segments.slice(themeIndex + 1);
    return themeSegments;
}

export default getParams;