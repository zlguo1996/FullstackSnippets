/**
 * 用于初始化的函数
 */


function shallowEqual<Params extends Array<any>>(a: Params, b: Params): boolean {
    return a.reduce((prev, cur, index) => prev && (a[index] === b[index]), true);
}

////////////////////////////////// 单次执行 //////////////////////////////////

// 只执行一次，第一次调用时执行
export function execOnceLazy<T, Params extends Array<any>>(
    asyncFunc: (...params: Params) => Promise<T>
): (...params: Params) => Promise<T> {
    let result: Promise<T> | undefined;
    let firstParams: Params;
    return (...params: Params) => {
        if (!result) {
            result = asyncFunc(...params);
            firstParams = params;
        } else if (!shallowEqual(firstParams, params)) { // 检测两次初始化输入的参数不一致
            throw new Error(`execOnceLazy with different parameters ${JSON.stringify(firstParams)} & ${JSON.stringify(params)}`);
        }
        return result;
    };
}

// 只执行一次，创建时执行
export function execOnceImmediate<T, Params extends Array<any>>(
    asyncFunc: (...params: Params) => Promise<T>, ...params: Params
) {
    const func = execOnceLazy(asyncFunc);
    func(...params);
    return func;
}

////////////////////////////////// 同步预执行 //////////////////////////////////

// 预执行executor。executor将会被执行两次，第一次为同步的使用localStorage的执行，第二次为使用真实的precheck的结果的执行。
export function execImmediateWithLocalStorage(options: {
    precheck: () => Promise<boolean>, // 返回true时执行executor
    executor: () => void,
    localStorageKey: string,
    defaultCheckRes: boolean
}) {
    const {
        precheck, executor, localStorageKey, defaultCheckRes
    } = options;

    const storage = localStorage.getItem(localStorageKey);

    let shouldExecuteFirstTime = defaultCheckRes;
    if (storage) {
        shouldExecuteFirstTime = JSON.parse(storage) as boolean;
    }

    if (shouldExecuteFirstTime) {
        executor();
    }

    precheck().then((shouldExecuteSecondTime) => {
        localStorage.setItem(localStorageKey, JSON.stringify(shouldExecuteSecondTime));

        if (shouldExecuteSecondTime) {
            executor();
        }
    });
}
