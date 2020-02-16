export function getIfExists<T>(value: T | undefined, defaultValue: T): T {
    return value === undefined ? defaultValue : value
}

export function getCookieValue(key: string, cookie: string): string {
    const cookies = cookie.split('; ')
    for (let i = cookies.length - 1; i >= 0; i--) {
        const c = cookies[i].split('=')
        if (c[0] === key) {
            return c[1]
        }
    }
    return ''
}
