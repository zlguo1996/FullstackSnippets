// 失败重试异步操作
export async function retry<T>(asyncFunc: () => Promise<T>, retryTimes: number) {
    let res: T | undefined;
    let err: any;

    for (let trys = 0; trys < retryTimes; trys++) {
        try {
            // eslint-disable-next-line no-await-in-loop
            res = await asyncFunc();
            err = undefined;
            break;
        } catch (e) {
            err = e;
        }
    }

    if (err) {
        throw err;
    }
    return res;
}